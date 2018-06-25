import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { scaleLinear } from "d3-scale";
import COLORS from "utils/styles";

const StyledLine = styled.line`
  stroke: #fff;

  &:hover {
    cursor: pointer;
    stroke: ${COLORS.DARK_GRAY};
  }
`;

class InteractiveGrid extends Component {
  state = {
    segments: Array.from({ length: this.props.rowCount * 2 - 1 }, (_, i) =>
      Array(this.props.colCount - 1 + (i % 2)).fill(0)
    )
  };

  handleClick = (row, col) => {
    this.setState(prevState => {});
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
    const styledLines = segments.reduce((components, row, colIdx) => {
      // even rows are vertical
      // odd rows are horizontal
      return [
        ...components,
        row.map((_, rowIdx) => <StyledLine x1={colIdx} />)
      ];
    }, []);
    return (
      <g strokeWidth={strokeWidth} stroke="white">
        {rowLines}
        {colLines}
        <rect
          x={paddingX}
          y={paddingY}
          width={width - 2 * paddingX}
          height={height - 2 * paddingY}
          fill="none"
          stroke={COLORS.DARK_GRAY}
        />
        <StyledLine x1={10} x2={10} y1={0} y2={1000} />
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
