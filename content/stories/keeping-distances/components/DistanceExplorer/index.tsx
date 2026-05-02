"use client";

import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { FC, useCallback } from "react";
import Caption from "@/components/story/shared/Caption";
import DraggableCircle from "@/components/story/shared/DraggableCircle";
import Graph from "@/components/story/shared/Graph";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { average, euclideanDistance } from "@/utils/mathHelpers";
import COLORS from "@/utils/styles";
import useDragState from "./useDragState";

const WIDTH = 600;
const HEIGHT = 600;
const CIRCLE_R = 8; // matches DraggableCircle default r

const xScale = scaleLinear().domain([-10, 10]).range([0, WIDTH]);
const yScale = scaleLinear().domain([-10, 10]).range([HEIGHT, 0]);

interface DistanceExplorerProps {
  caption?: string;
}

const DistanceExplorer: FC<DistanceExplorerProps> = ({ caption }) => {
  const [points, handleDrag] = useDragState(
    [
      { x: -2, y: -2 },
      { x: 2, y: 2 },
    ],
    xScale,
    yScale
  );

  const offset = CIRCLE_R * 2;
  const clampedHandleDrag = useCallback(
    (idx: number, coords: { x: number; y: number }) =>
      handleDrag(idx, {
        x: Math.max(offset, Math.min(WIDTH - offset, coords.x)),
        y: Math.max(offset, Math.min(HEIGHT - offset, coords.y)),
      }),
    [handleDrag, offset]
  );

  const scaledPoints = points.map(({ x, y }) => ({
    x: xScale(x),
    y: yScale(y),
  }));

  const theta = Math.atan(
    (points[1].y - points[0].y) / (points[1].x - points[0].x)
  );
  const [minX, maxX] = extent(scaledPoints, (d) => d.x) as [number, number];
  const [minY, maxY] = extent(scaledPoints, (d) => d.y) as [number, number];
  const textX = average(scaledPoints, (p) => p.x);
  const textY = average(scaledPoints, (p) => p.y);

  return (
    <Caption caption={caption}>
      <NarrowContainer width="50%">
        <Graph
          xAxisPosition="center"
          yAxisPosition="center"
          width={WIDTH}
          height={HEIGHT}
          svgId="distance-explorer"
          xScale={xScale}
          yScale={yScale}
          tickStep={() => 1}
        >
          <g stroke="black" strokeWidth={3} strokeDasharray="3">
            {scaledPoints[0].x === minX && (
              <line x1={maxX} x2={maxX} y1={minY} y2={maxY} />
            )}
            {scaledPoints[0].x === maxX && (
              <line x1={minX} x2={minX} y1={minY} y2={maxY} />
            )}
            {scaledPoints[0].y === minY && (
              <line x1={minX} x2={maxX} y1={minY} y2={minY} />
            )}
            {scaledPoints[0].y === maxY && (
              <line x1={minX} x2={maxX} y1={maxY} y2={maxY} />
            )}
          </g>
          <line
            x1={scaledPoints[0].x}
            x2={scaledPoints[1].x}
            y1={scaledPoints[0].y}
            y2={scaledPoints[1].y}
            stroke={COLORS.ORANGE}
            strokeWidth={3}
          />
          <text
            x={textX}
            y={textY}
            fill={COLORS.ORANGE}
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${(-180 / Math.PI) * theta}, ${textX}, ${textY})`}
            dy={-Math.sign(theta) * 20}
            style={{ userSelect: "none" }}
          >
            {euclideanDistance(
              points[1].x - points[0].x,
              points[1].y - points[0].y
            ).toFixed(2)}
          </text>
          {scaledPoints.map((point, idx) => (
            <DraggableCircle
              key={idx}
              id={idx}
              cx={point.x}
              cy={point.y}
              onDrag={clampedHandleDrag}
            />
          ))}
        </Graph>
      </NarrowContainer>
    </Caption>
  );
};

export default DistanceExplorer;
