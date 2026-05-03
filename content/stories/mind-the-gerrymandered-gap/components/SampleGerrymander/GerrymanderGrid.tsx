"use client";

import { scaleLinear } from "d3-scale";
import type { FC, ReactNode } from "react";
import ClippedSVG from "@/components/story/shared/ClippedSVG";

interface GerrymanderGridProps {
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
  rowCount: number;
  colCount: number;
  colorRange: [string, string];
  children?: ReactNode;
}

const GerrymanderGrid: FC<GerrymanderGridProps> = ({
  width,
  height,
  paddingX,
  paddingY,
  rowCount,
  colCount,
  colorRange,
  children,
}) => {
  const xScale = scaleLinear()
    .domain([0, colCount])
    .range([paddingX, width - paddingX]);
  const yScale = scaleLinear()
    .domain([0, rowCount])
    .range([height - paddingY, paddingY]);

  const rectW = xScale(1) - xScale(0) - 2;
  const rectH = yScale(0) - yScale(1) - 2;

  return (
    <ClippedSVG
      id="gerrymander-grid"
      width={width}
      height={height}
      clipChildren={false}
    >
      {Array.from({ length: colCount }, (_, x) => x)
        .flatMap((cx) =>
          Array.from({ length: rowCount }, (_, y) => y).map((cy) => ({
            cx,
            cy,
            cellKey: `${cx}:${cy}`,
          })),
        )
        .map(({ cx, cy, cellKey }) => (
          <rect
            key={cellKey}
            x={xScale(cx) + 1}
            y={yScale(cy + 1) + 1}
            width={rectW}
            height={rectH}
            fill={colorRange[cy % 2]}
          />
        ))}
      {children}
    </ClippedSVG>
  );
};

export default GerrymanderGrid;
