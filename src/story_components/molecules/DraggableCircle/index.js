import React, { useContext } from "react";
import PropTypes from "prop-types";
import Draggable from "react-draggable";
import { NoScrollCircle } from "story_components";
import COLORS from "utils/styles";
import { SVGContext } from "contexts";

function handleDrag(id, onDrag) {
  return function(_, { x, y }) {
    onDrag(id, { x, y });
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
      onStart={onDragStart}
      onDrag={handleDrag(id, onDrag)}
      onStop={onDragEnd}
      defaultPosition={{ x: cx, y: cy }}
      bounds={getBounds(svgBounds, r)}
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
