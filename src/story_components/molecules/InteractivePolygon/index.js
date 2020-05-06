import React from "react";
import PropTypes from "prop-types";
import { DraggableCircle, Polygon } from "story_components";
import COLORS from "utils/styles";

const defaultHandleDrag = (i, coords) => console.log(i, coords);
const defaultPts = [];

function InteractivePolygon({
  circleRadius = 8,
  handleDrag = defaultHandleDrag,
  fill = COLORS.BLACK,
  points = defaultPts,
  stroke = COLORS.BLACK,
  strokeWidth = 3
}) {
  let circles = points.map((point, i) => (
    <DraggableCircle
      cx={point.x}
      cy={point.y}
      fill={fill}
      key={i}
      id={i}
      onDrag={handleDrag}
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
  let polygon = <Polygon points={points} fill={fill} stroke="none" />;
  return (
    <g>
      {polygon}
      {lines}
      {circles}
    </g>
  );
}

InteractivePolygon.propTypes = {
  circleRadius: PropTypes.number,
  handleDrag: PropTypes.func,
  fill: PropTypes.string,
  points: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })
  ),
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number
};

export default React.memo(InteractivePolygon);
