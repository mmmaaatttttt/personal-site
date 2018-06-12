import React, { Component } from "react";
import PropTypes from "prop-types";
import { HeatChart, NarrowContainer } from "story_components";
import COLORS from "utils/styles";

class InteractiveGrid extends Component {
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
    const rowLines = Array.from({ length: rowCount - 1 }, (_, i) => {
      const y = paddingY + ((height - 2 * paddingY) / rowCount) * (i + 1);
      return (
        <line
          key={`x:${i}`}
          x1={paddingX}
          x2={width - paddingX}
          y1={y}
          y2={y}
        />
      );
    });
    const colLines = Array.from({ length: colCount - 1 }, (_, i) => {
      const x = paddingX + ((width - 2 * paddingX) / colCount) * (i + 1);
      return (
        <line
          key={`y:${i}`}
          x1={x}
          x2={x}
          y1={paddingY}
          y2={height - paddingY}
        />
      );
    });
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

class GerrymanderSample extends Component {
  render() {
    const { rowCount, colCount } = this.props;
    const heatData = Array.from({ length: colCount }, () =>
      Array.from({ length: rowCount }, (_, i) => i % 2)
    );
    return (
      <NarrowContainer width="60%">
        <h1>hi</h1>
        <HeatChart
          data={heatData}
          axes={false}
          tooltip={false}
          colorRange={[COLORS.ORANGE, COLORS.GREEN]}
        >
          <InteractiveGrid
            strokeWidth={6}
            rowCount={rowCount}
            colCount={colCount}
          />
        </HeatChart>
      </NarrowContainer>
    );
  }
}

GerrymanderSample.propTypes = {
  rowCount: PropTypes.number.isRequired,
  colCount: PropTypes.number.isRequired
};

GerrymanderSample.defaultProps = {
  rowCount: 6,
  colCount: 10
};

export default GerrymanderSample;
