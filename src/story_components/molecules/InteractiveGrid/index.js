import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { scaleLinear } from "d3-scale";
import COLORS, { hexToRgba } from "utils/styles";

const StyledLine = styled.line`
  stroke: ${props => (props.isOn ? COLORS.DARK_GRAY : COLORS.WHITE)};

  ${props =>
    props.isHovered &&
    css`
      &:hover {
        cursor: pointer;
        stroke: ${props =>
          props.isOn
            ? hexToRgba(COLORS.RED, 0.9)
            : hexToRgba(COLORS.DARK_GRAY, 0.6)};
      }
    `};
`;

class InteractiveGrid extends Component {
  state = {
    activeSegmentStatus: null,
    hovered: null
  };

  componentDidMount() {
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown = (row, col, e) => {
    const { segments } = this.props;
    e.persist();
    this.setState({ activeSegmentStatus: !segments[row][col] }, () => {
      this.props.handleSegmentUpdate(
        row,
        col,
        this.state.activeSegmentStatus,
        e
      );
    });
  };

  handleMouseEnter = (row, col, e) => {
    e.persist();
    this.props.handleSegmentUpdate(row, col, this.state.activeSegmentStatus, e);
  };

  handleMouseMove = (row, col, e) => {
    const { hovered, activeSegmentStatus } = this.state;
    if (
      activeSegmentStatus === null &&
      (!hovered || hovered[0] !== row || hovered[1] !== col)
    ) {
      this.setState({ hovered: [row, col] });
    }
  };

  handleMouseOut = () => {
    this.setState({ hovered: null });
  };

  handleMouseUp = () => {
    this.setState({ activeSegmentStatus: null, hovered: null });
  };

  render() {
    const {
      width,
      height,
      paddingX,
      paddingY,
      strokeWidth,
      rowCount,
      colCount,
      segments
    } = this.props;
    const { activeSegmentStatus, hovered } = this.state;
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
          let xOffset = (strokeWidth / 2) * parity;
          let yOffset = (strokeWidth / 2) * (1 - parity);
          return {
            x1: xScale(colIdx + 1 - parity) - xOffset,
            x2: xScale(colIdx + 1) + xOffset,
            y1: yScale((rowIdx + parity) / 2) + yOffset,
            y2: yScale((rowIdx + parity) / 2 + (1 - parity)) - yOffset,
            isOn,
            rowIdx,
            colIdx
          };
        });
        return [...data, ...lines];
      }, [])
      .sort((d1, d2) => {
        if (hovered) {
          if (d1.rowIdx === hovered[0] && d1.colIdx === hovered[1]) return 1;
          if (d2.rowIdx === hovered[0] && d2.colIdx === hovered[1]) return -1;
        }
        return d1.isOn - d2.isOn;
      });
    const styledLines = styledLineData.map(d => (
      <StyledLine
        x1={d.x1}
        x2={d.x2}
        y1={d.y1}
        y2={d.y2}
        isOn={d.isOn}
        onMouseDown={this.handleMouseDown.bind(this, d.rowIdx, d.colIdx)}
        onMouseEnter={this.handleMouseEnter.bind(this, d.rowIdx, d.colIdx)}
        onMouseMove={this.handleMouseMove.bind(this, d.rowIdx, d.colIdx)}
        onMouseOut={this.handleMouseOut}
        isHovered={
          activeSegmentStatus === null &&
          hovered &&
          hovered[0] === d.rowIdx &&
          hovered[1] === d.colIdx
        }
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
          rx={10}
          ry={10}
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
  colCount: PropTypes.number.isRequired,
  handleSegmentUpdate: PropTypes.func.isRequired,
  segments: PropTypes.array.isRequired
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
