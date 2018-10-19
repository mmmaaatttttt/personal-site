import React, { Component } from "react";
import PropTypes from "prop-types";
import { DraggableCircle } from "story_components";
import COLORS from "utils/styles";

class InteractivePolygon extends Component {
  getPointsString = () => {
    return this.props.points
      .reduce((str, obj) => `${str} ${obj.x},${obj.y}`, "")
      .trim();
  };

  render() {
    const { circleRadius, fill, points, stroke, strokeWidth } = this.props;
    let circles = points.map((point, i) => (
      <DraggableCircle
        cx={point.x}
        cy={point.y}
        fill={fill}
        key={i}
        onDrag={coords => this.props.handleDrag(i, coords)}
        r={circleRadius}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    ));
    let lines = points.map((point, i) => {
      let nextPoint = points[(i + 1) % points.length];
      return (
        <line
          x1={point.x}
          x2={nextPoint.x}
          y1={point.y}
          y2={nextPoint.y}
          stroke={stroke}
          strokeWidth={strokeWidth}
          key={`${i}-${i + 1}`}
        />
      );
    });
    let polygon = <polygon points={this.getPointsString()} fill={fill} />;
    return (
      <g>
        {polygon}
        {lines}
        {circles}
      </g>
    );
  }
}

InteractivePolygon.propTypes = {
  circleRadius: PropTypes.number.isRequired,
  handleDrag: PropTypes.func.isRequired,
  fill: PropTypes.string.isRequired,
  points: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  ).isRequired,
  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired
};

InteractivePolygon.defaultProps = {
  circleRadius: 8,
  handleDrag: coords => console.log(coords),
  fill: COLORS.BLACK,
  points: [],
  stroke: COLORS.BLACK,
  strokeWidth: 3
};

export default InteractivePolygon;
