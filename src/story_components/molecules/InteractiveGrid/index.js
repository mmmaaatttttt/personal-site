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
    });
  };

  handleMouseEnter = (row, col) => {
    if (this.state.activeSegmentStatus !== null) {
      this.setState(prevState => {
        const segments = [...prevState.segments];
        segments[row] = [...prevState.segments[row]];
        segments[row][col] = prevState.activeSegmentStatus;
        return { segments };
      });
    }
  };

  handleMouseUp = () => {
    this.setState({ activeSegmentStatus: null });
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
    const styledLines = segments.reduce((components, row, rowIdx) => {
      let lines = row.map((isOn, colIdx) => {
        // even rows are vertical
        // odd rows are horizontal
        let parity = rowIdx % 2; // 0 if even, 1 if odd
        let points = {
          x1: xScale(colIdx + 1 - parity),
          x2: xScale(colIdx + 1),
          y1: yScale((rowIdx + parity) / 2),
          y2: yScale((rowIdx + parity) / 2 + (1 - parity)),
          isOn
        };
        return (
          <StyledLine
            {...points}
            onMouseDown={this.handleMouseDown.bind(this, rowIdx, colIdx)}
            onMouseEnter={this.handleMouseEnter.bind(this, rowIdx, colIdx)}
            onMouseUp={this.handleMouseUp}
          />
        );
      });
      return [...components, lines];
    }, []);
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
