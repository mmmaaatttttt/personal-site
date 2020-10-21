import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  ClippedSVG,
  InteractivePolygon,
  LabeledSlider,
  StyledTable,
  SVGBorder
} from "story_components";
import {
  crossingExists,
  generatePointsFromCount,
  getCircleParams,
  getAreaInfo
} from "./helpers";
import COLORS from "utils/styles";

function IsoperimetricExplorer({
  circleRadius = 8,
  height = 400,
  initialSides = 3,
  maxSides = 20,
  strokeWidth = 3,
  width = 600
}) {
  const [points, setPoints] = useState(() =>
    generatePointsFromCount({
      width,
      height,
      initialSides,
      newCount: initialSides
    })
  );

  const handleDrag = useCallback(
    (idx, coords) => {
      // cancel drag if intersection exists
      if (crossingExists(points, idx)) return false;

      setPoints(oldPoints =>
        oldPoints.map((pt, i) => (i === idx ? { ...coords } : pt))
      );
    },
    [points]
  );

  const handleValueChange = useCallback(
    newCount => {
      generatePointsFromCount({ width, height, initialSides, newCount });
    },
    [width, height, initialSides]
  );

  let { x, y, r } = getCircleParams(points);
  let baseArea = Math.PI * r ** 2;
  let { circleArea, polygonArea, ratio } = getAreaInfo({ points, baseArea, r });
  return (
    <div>
      <LabeledSlider
        min={initialSides}
        max={maxSides}
        step={1}
        value={points.length}
        title={`Number of district sides: ${points.length}`}
        handleValueChange={handleValueChange}
        color={COLORS.DARK_GRAY}
      />
      <ClippedSVG
        width={width}
        height={height}
        marginTop={"0.5rem"}
        id="isoperimetric-svg"
      >
        <SVGBorder />
        <circle
          cx={x}
          cy={y}
          r={r}
          fill={COLORS.GRAY}
          stroke={COLORS.DARK_GRAY}
          strokeWidth={strokeWidth}
        />
        <InteractivePolygon
          circleRadius={circleRadius}
          fill={COLORS.GREEN}
          handleDrag={handleDrag}
          points={points}
          stroke={COLORS.DARK_GREEN}
          strokeWidth={strokeWidth}
        />
      </ClippedSVG>
      <StyledTable>
        <tbody>
          <tr>
            <td>Circle Area: {circleArea}</td>
            <td>Polygon Area: {polygonArea}</td>
            <td>Ratio: {ratio}</td>
          </tr>
        </tbody>
      </StyledTable>
    </div>
  );
}

IsoperimetricExplorer.propTypes = {
  circleRadius: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  initialSides: PropTypes.number.isRequired,
  maxSides: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default IsoperimetricExplorer;
