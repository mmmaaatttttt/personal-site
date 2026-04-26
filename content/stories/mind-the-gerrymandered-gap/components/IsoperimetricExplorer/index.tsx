"use client";

import { FC, useEffect, useState } from "react";
import ClippedSVG from "@/components/story/shared/ClippedSVG";
import LabeledSlider from "@/components/story/shared/Slider/LabeledSlider";
import StyledTable from "@/components/story/shared/StyledTable";
import COLORS from "@/utils/styles";
import InteractivePolygon from "./InteractivePolygon";
import { crossingExists } from "./crossingHelpers";
import { generatePoints, getCircleParams, getAreaInfo, type Point } from "./mathHelpers";

const WIDTH = 600;
const HEIGHT = 400;
const INITIAL_SIDES = 3;
const STROKE_WIDTH = 3;
const CIRCLE_RADIUS = 8;
const MAX_SIDES = 20;

const IsoperimetricExplorer: FC = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [baseArea, setBaseArea] = useState(1);

  useEffect(() => {
    const initial = generatePoints(INITIAL_SIDES, INITIAL_SIDES, WIDTH, HEIGHT);
    setPoints(initial);
    const { r } = getCircleParams(initial);
    setBaseArea(Math.PI * r ** 2);
  }, []);

  const handleSliderChange = (newCount: number) => {
    const next = generatePoints(newCount, INITIAL_SIDES, WIDTH, HEIGHT);
    setPoints(next);
    const { r } = getCircleParams(next);
    setBaseArea(Math.PI * r ** 2);
  };

  const handleDrag = (idx: number, coords: { x: number; y: number }) => {
    const next = [...points];
    next[idx] = { ...coords };
    if (crossingExists(next, idx)) return;
    setPoints(next);
  };

  if (!points.length) return null;

  const circle = getCircleParams(points);
  const { circleArea, polygonArea, ratio } = getAreaInfo(points, circle.r, baseArea);

  return (
    <div>
      <LabeledSlider
        min={INITIAL_SIDES}
        max={MAX_SIDES}
        step={1}
        value={points.length}
        title={`Number of district sides: ${points.length}`}
        handleValueChange={handleSliderChange}
        color={COLORS.DARK_GRAY}
      />
      <ClippedSVG
        width={WIDTH}
        height={HEIGHT}
        id="isoperimetric-svg"
        marginTop="0.5rem"
        clipChildren={false}
      >
        <rect
          x={0}
          y={0}
          width={WIDTH}
          height={HEIGHT}
          stroke={COLORS.GRAY}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <circle
          cx={circle.x}
          cy={circle.y}
          r={circle.r}
          fill={COLORS.GRAY}
          stroke={COLORS.DARK_GRAY}
          strokeWidth={STROKE_WIDTH}
        />
        <InteractivePolygon
          points={points}
          fill={COLORS.GREEN}
          stroke={COLORS.DARK_GREEN}
          strokeWidth={STROKE_WIDTH}
          circleRadius={CIRCLE_RADIUS}
          onDrag={handleDrag}
        />
      </ClippedSVG>
      <StyledTable
        data={[
          ["Circle Area", "Polygon Area", "Ratio"],
          [circleArea, polygonArea, ratio],
        ]}
      />
    </div>
  );
};

export default IsoperimetricExplorer;
