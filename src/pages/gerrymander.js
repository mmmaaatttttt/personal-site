import React, { Component } from "react";
import PropTypes from "prop-types";
import { HeatChart, InteractiveGrid, NarrowContainer } from "story_components";
import COLORS from "utils/styles";

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
