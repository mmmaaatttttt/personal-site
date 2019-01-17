import React, { Component } from "react";
import PropTypes from "prop-types";
import COLORS from "utils/styles";

class Polygon extends Component {
  getPointsString = () => {
    const { points } = this.props;
    return points.map(p => `${p.x},${p.y}`).join(" ");
  };

  render() {
    const { fill, stroke, strokeWidth } = this.props;
    return (
      <polygon
        points={this.getPointsString()}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  }
}

Polygon.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  ).isRequired,
  fill: PropTypes.string.isRequired,
  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired
};

Polygon.defaultProps = {
  fill: COLORS.BLACK,
  points: [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 }
  ],
  stroke: COLORS.BLACK,
  strokeWidth: 3
};

export default Polygon;
