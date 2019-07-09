import React, { useContext } from "react";
import PropTypes from "prop-types";
import Draggable from "react-draggable";
import { NoScrollCircle } from "story_components";
import COLORS from "utils/styles";
import { SVGContext } from "contexts";

function handleDrag(id, onDrag, cx, cy, axis) {
  return function(_, { x, y }) {
    const position = { x, y };
    if (axis === "y") position.x = cx;
    if (axis === "x") position.y = cy;
    onDrag(id, position);
  };
}

function getBounds(svgBounds, circleR) {
  const { width, height, padding } = svgBounds;
  const circleOffset = circleR * 2;
  return {
    top: padding.top + circleOffset,
    left: padding.left + circleOffset,
    right: width - padding.right - circleOffset,
    bottom: height - padding.bottom - circleOffset
  };
}

function DraggableCircle({
  axis,
  cx,
  cy,
  r,
  fill,
  stroke,
  strokeWidth,
  id,
  onDrag,
  onDragStart,
  onDragEnd
}) {
  const svgBounds = useContext(SVGContext);
  return (
    <Draggable
      axis={axis}
      bounds={getBounds(svgBounds, r)}
      defaultPosition={{ x: cx, y: cy }}
      onStart={onDragStart}
      onDrag={handleDrag(id, onDrag, cx, cy, axis)}
      onStop={onDragEnd}
    >
      <NoScrollCircle
        bounds="parent"
        cx={0}
        cy={0}
        fill={fill}
        r={r}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </Draggable>
  );
}

DraggableCircle.propTypes = {
  axis: PropTypes.oneOf(["both", "x", "y", "none"]).isRequired,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  id: PropTypes.any.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  r: PropTypes.number.isRequired,
  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired
};

DraggableCircle.defaultProps = {
  axis: "both",
  cx: 0,
  cy: 0,
  fill: COLORS.BLACK,
  id: 0,
  onDragStart: () => {},
  onDrag: () => {},
  onDragEnd: () => {},
  r: 8,
  stroke: COLORS.BLACK,
  strokeWidth: 0
};

export default React.memo(DraggableCircle);
