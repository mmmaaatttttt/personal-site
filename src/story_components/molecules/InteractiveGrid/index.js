import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { scaleLinear } from "d3-scale";
import COLORS, { hexToRgba } from "utils/styles";

const StyledLine = styled.line`
  stroke: ${props => (props.isOn ? COLORS.DARK_GRAY : COLORS.WHITE)};

  &:hover {
    cursor: pointer;
    stroke: ${props =>
      props.isOn ? hexToRgba(COLORS.DARK_GRAY, 0.6) : COLORS.DARK_GRAY};
  }
`;

class InteractiveGrid extends Component {
  state = {
    segments: Array.from({ length: this.props.rowCount * 2 - 1 }, (_, i) =>
      Array(this.props.colCount - 1 + (i % 2)).fill(false)
    ),
    activeSegmentStatus: null
  };

  componentDidMount() {
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown = (row, col) => {
    this.setState(prevState => {
      const segments = [...prevState.segments];
      segments[row] = [...prevState.segments[row]];
      const activeSegmentStatus = !segments[row][col];
      segments[row][col] = activeSegmentStatus;
      return { segments, activeSegmentStatus };
    }, this.__countRegions);
  };

  handleMouseEnter = (row, col, e) => {
    // find the number of lines under the mouse
    // this count will be greater than 2 if at an intersection
    const lineCount = document
      .elementsFromPoint(e.pageX, e.pageY)
      .filter(el => el.tagName === "line").length;
    if (this.state.activeSegmentStatus !== null && lineCount === 2) {
      this.setState(prevState => {
        const segments = [...prevState.segments];
        segments[row] = [...prevState.segments[row]];
        segments[row][col] = prevState.activeSegmentStatus;
        return { segments };
      }, this.__countRegions);
    }
  };

  handleMouseUp = () => {
    this.setState({ activeSegmentStatus: null });
  };

  __countRegions = () => {
    const { rowCount, colCount } = this.props;
    const visitedYet = Array.from({ length: rowCount }, () =>
      Array.from({ length: colCount }).fill(false)
    );
    const counts = [];
    visitedYet.forEach((row, rowIdx) => {
      row.forEach((isVisited, colIdx) => {
        if (!isVisited) {
          counts.push(this.__calculateArea(visitedYet, [[rowIdx, colIdx]]));
        }
      });
    });
    console.log(counts);
    return counts;
  };

  __calculateArea = (visitedYet, whereToLook) => {
    const { segments } = this.state;
    let count = 0;
    while (whereToLook.length > 0) {
      let [row, col] = whereToLook.shift();
      if (visitedYet[row][col] === false) {
        visitedYet[row][col] = true;
        count++;
        let shouldMoveUp =
          visitedYet[row - 1] !== undefined &&
          visitedYet[row - 1][col] === false &&
          segments[2 * row - 1][col] === false;
        let shouldMoveRight =
          visitedYet[row][col + 1] !== undefined &&
          visitedYet[row][col + 1] === false &&
          segments[2 * row][col] === false;
        let shouldMoveDown =
          visitedYet[row + 1] !== undefined &&
          visitedYet[row + 1][col] === false &&
          segments[2 * row + 1][col] === false;
        let shouldMoveLeft =
          visitedYet[row][col - 1] !== undefined &&
          visitedYet[row][col - 1] === false &&
          segments[2 * row][col - 1] === false;
        if (shouldMoveUp) whereToLook.push([row - 1, col]);
        if (shouldMoveRight) whereToLook.push([row, col + 1]);
        if (shouldMoveDown) whereToLook.push([row + 1, col]);
        if (shouldMoveLeft) whereToLook.push([row, col - 1]);
      }
    }
    return count;
  };

  render() {
    const {
      width,
      height,
      paddingX,
      paddingY,
      strokeWidth,
      rowCount,
      colCount
    } = this.props;
    const { segments } = this.state;
    const xScale = scaleLinear()
      .domain([0, colCount])
      .range([paddingX, width - paddingX]);
    const yScale = scaleLinear()
      .domain([0, rowCount])
      .range([height - paddingY, paddingY]);
    const rowLines = Array.from({ length: rowCount - 1 }, (_, i) => {
      const y = yScale(i + 1);
      return (
        <line
          key={`x:${i}`}
          x1={xScale(0)}
          x2={xScale(colCount)}
          y1={y}
          y2={y}
        />
      );
    });
    const colLines = Array.from({ length: colCount - 1 }, (_, i) => {
      const x = xScale(i + 1);
      return (
        <line
          key={`y:${i}`}
          x1={x}
          x2={x}
          y1={yScale(rowCount)}
          y2={yScale(0)}
        />
      );
    });
    const styledLineData = segments
      .reduce((data, row, rowIdx) => {
        let lines = row.map((isOn, colIdx) => {
          // even rows are vertical
          // odd rows are horizontal
          let parity = rowIdx % 2; // 0 if even (vertical), 1 if odd (horizontal)
          // set size based on isOn status
          let onMultiplier = isOn ? -1 : 1;
          let xOffset = (strokeWidth / 2) * parity * onMultiplier;
          let yOffset = (strokeWidth / 2) * (1 - parity) * onMultiplier;
          return {
            x1: xScale(colIdx + 1 - parity) + xOffset,
            x2: xScale(colIdx + 1) - xOffset,
            y1: yScale((rowIdx + parity) / 2) - yOffset,
            y2: yScale((rowIdx + parity) / 2 + (1 - parity)) + yOffset,
            isOn,
            rowIdx,
            colIdx
          };
        });
        return [...data, ...lines];
      }, [])
      .sort((d1, d2) => d1.isOn - d2.isOn);
    const styledLines = styledLineData.map(d => (
      <StyledLine
        x1={d.x1}
        x2={d.x2}
        y1={d.y1}
        y2={d.y2}
        isOn={d.isOn}
        onMouseDown={this.handleMouseDown.bind(this, d.rowIdx, d.colIdx)}
        onMouseEnter={this.handleMouseEnter.bind(this, d.rowIdx, d.colIdx)}
        onMouseUp={this.handleMouseUp}
        key={`${d.rowIdx}:${d.colIdx}`}
      />
    ));
    return (
      <g strokeWidth={strokeWidth} stroke="white">
        {rowLines}
        {colLines}
        {styledLines}
        <rect
          x={paddingX}
          y={paddingY}
          width={width - 2 * paddingX}
          height={height - 2 * paddingY}
          fill="none"
          stroke={COLORS.DARK_GRAY}
        />
      </g>
    );
  }
}

InteractiveGrid.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  paddingX: PropTypes.number.isRequired,
  paddingY: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  colCount: PropTypes.number.isRequired
};

InteractiveGrid.defaultProps = {
  width: 600,
  height: 600,
  paddingX: 45,
  paddingY: 45,
  strokeWidth: 5,
  rowCount: 12,
  colCount: 12
};

export default InteractiveGrid;
