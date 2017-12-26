import React, { Component } from "react";
import PropTypes from "prop-types";
import COLORS from "../../utils/styles";

class EconomyForceGraph extends Component {
  render() {
    const { cx, cy, people } = this.props;
    const circles = Array.from({ length: people }, (_, i) => (
      <circle key={i} cx={cx} cy={cy} r={5} fill={COLORS.MAROON} />
    ));
    return <g>{circles}</g>;
  }
}

EconomyForceGraph.propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  people: PropTypes.number.isRequired
};

export default EconomyForceGraph;
