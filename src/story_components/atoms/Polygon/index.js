import React, { useMemo } from "react";
import PropTypes from "prop-types";
import COLORS from "utils/styles";

const defaultPoints = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 }
];
function Polygon({
  fill = COLORS.BLACK,
  open = false,
  points = defaultPoints,
  stroke = COLORS.BLACK,
  strokeWidth = 3
}) {
  const pointsStr = useMemo(() => points.map(p => `${p.x},${p.y}`).join(" "), [
    points
  ]);

  return open ? (
    <polyline
      points={pointsStr}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  ) : (
    <polygon
      points={pointsStr}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

Polygon.propTypes = {
  fill: PropTypes.string,
  open: PropTypes.bool,
  points: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })
  ),
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number
};

export default React.memo(Polygon);
