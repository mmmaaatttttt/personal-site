"use client";

import { type ScaleLinear, scaleLinear } from "d3-scale";
import type { FC, ReactNode } from "react";
import Axis from "@/components/story/shared/Axis";
import Graph from "@/components/story/shared/Graph";
import LinePlot from "@/components/story/shared/LinePlot";
import type { Point } from "@/types/geometry";
import COLORS from "@/utils/styles";
import type { FixedPoint } from "../../mathUtils";

const CURVE_RESOLUTION = 200;
export const CHART_WIDTH = 500;
export const CHART_HEIGHT = 500;
export const CHART_PADDING = { top: 30, bottom: 60, left: 60, right: 30 };
const FIXED_POINT_RADIUS = 7;

interface CobwebChartProps {
  map: (probability: number) => number;
  domain?: [number, number];
  cobwebPath: Point[];
  fixedPoints: FixedPoint[];
  width?: number;
  height?: number;
  xScale?: ScaleLinear<number, number>;
  yScale?: ScaleLinear<number, number>;
  children?: ReactNode;
}

const CobwebChart: FC<CobwebChartProps> = ({
  map,
  domain = [0, 1],
  cobwebPath,
  fixedPoints,
  width = CHART_WIDTH,
  height = CHART_HEIGHT,
  xScale,
  yScale,
  children,
}) => {
  const resolvedXScale =
    xScale ??
    scaleLinear()
      .domain(domain)
      .range([CHART_PADDING.left, width - CHART_PADDING.right]);
  const resolvedYScale =
    yScale ??
    scaleLinear()
      .domain(domain)
      .range([height - CHART_PADDING.bottom, CHART_PADDING.top]);

  const curveData = Array.from({ length: CURVE_RESOLUTION + 1 }, (_, i) => {
    const x = domain[0] + ((domain[1] - domain[0]) * i) / CURVE_RESOLUTION;
    return { x, y: map(x) };
  });

  const diagonalData = [
    { x: domain[0], y: domain[0] },
    { x: domain[1], y: domain[1] },
  ];

  return (
    <Graph
      xScale={resolvedXScale}
      yScale={resolvedYScale}
      width={width}
      height={height}
      graphPadding={CHART_PADDING}
      axes={false}
      xLabel="Contract Price (aka Probability)"
      yLabel="Event Probability at Given Price"
    >
      <Axis
        key="y-axis"
        direction="y"
        scale={resolvedYScale}
        tickFormat=".2f"
      />
      <Axis
        key="x-axis"
        direction="x"
        scale={resolvedXScale}
        tickFormat=".2f"
        rotateLabels={false}
        textAnchor="middle"
        labelPosition={{ dy: "0.71em" }}
      />
      <LinePlot
        graphData={diagonalData}
        curve="curveLinear"
        stroke={COLORS.GRAY}
        strokeWidth={2}
      />
      <LinePlot
        graphData={curveData}
        curve="curveNatural"
        stroke={COLORS.BLUE}
        strokeWidth={3}
      />
      <LinePlot
        graphData={cobwebPath}
        curve="curveLinear"
        stroke={COLORS.DARK_GRAY}
        strokeWidth={1.5}
        opacity={0.8}
      />
      {fixedPoints.map((fp) => (
        <circle
          key={fp.probability}
          cx={resolvedXScale(fp.probability)}
          cy={resolvedYScale(fp.probability)}
          r={FIXED_POINT_RADIUS}
          fill={fp.stable ? COLORS.DARK_GREEN : COLORS.RED}
        />
      ))}
      {children}
    </Graph>
  );
};

export default CobwebChart;
