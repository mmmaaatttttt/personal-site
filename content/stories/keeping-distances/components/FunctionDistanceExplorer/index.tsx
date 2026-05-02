"use client";

import { scaleLinear } from "d3-scale";
import { FC, useCallback, useState } from "react";
import Caption from "@/components/story/shared/Caption";
import DraggableCircle from "@/components/story/shared/DraggableCircle";
import Graph from "@/components/story/shared/Graph";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import ToggleSwitch from "@/components/story/shared/ToggleSwitch";
import COLORS from "@/utils/styles";
import useDragState from "../DistanceExplorer/useDragState";
import { clamped, l1Norm, lInfNormEndpoints } from "./helpers";

const WIDTH = 600;
const HEIGHT = 600;
const PADDING = 20;

const xScale = scaleLinear()
  .domain([0, 5])
  .range([PADDING, WIDTH - PADDING]);
const yScale = scaleLinear()
  .domain([0, 5])
  .range([HEIGHT - PADDING, PADDING]);

const X_DOMAIN = xScale.domain() as [number, number];
const Y_DOMAIN = yScale.domain() as [number, number];
const X_AVG = (X_DOMAIN[0] + X_DOMAIN[1]) / 2;

const INITIAL_POINTS = [
  { x: X_DOMAIN[0], y: Y_DOMAIN[1] - 1 }, // f1 left
  { x: X_AVG, y: Y_DOMAIN[1] - 1 }, // f1 mid
  { x: X_DOMAIN[1], y: Y_DOMAIN[1] - 1 }, // f1 right
  { x: X_DOMAIN[0], y: Y_DOMAIN[0] + 1 }, // f2 left
  { x: X_AVG, y: Y_DOMAIN[0] + 1 }, // f2 mid
  { x: X_DOMAIN[1], y: Y_DOMAIN[0] + 1 }, // f2 right
];

interface FunctionDistanceExplorerProps {
  caption?: string;
}

const FunctionDistanceExplorer: FC<FunctionDistanceExplorerProps> = ({
  caption,
}) => {
  const [points, handleDrag] = useDragState(INITIAL_POINTS, xScale, yScale);
  const [l1NormActive, setL1NormActive] = useState(false);

  // Endpoint points (idx 0,2,3,5) are y-only; midpoints (idx 1,4) move freely.
  const constrainedHandleDrag = useCallback(
    (idx: number, coords: { x: number; y: number }) => {
      const isMidpoint = idx === 1 || idx === 4;
      handleDrag(idx, {
        x: isMidpoint ? coords.x : xScale(points[idx].x),
        y: coords.y,
      });
    },
    [handleDrag, points]
  );

  const clamped1 = clamped(points.slice(0, 3), X_DOMAIN, Y_DOMAIN);
  const clamped2 = clamped(points.slice(3), X_DOMAIN, Y_DOMAIN);

  const graph1Pts = clamped1.map((pt) => ({ x: xScale(pt.x), y: yScale(pt.y) }));
  const graph2Pts = clamped2.map((pt) => ({ x: xScale(pt.x), y: yScale(pt.y) }));

  const lInfSeg = lInfNormEndpoints(graph1Pts, graph2Pts);
  const lInfDistance = Math.abs(
    yScale.invert(lInfSeg.y1) - yScale.invert(lInfSeg.y2)
  ).toFixed(2);
  const area = l1Norm(clamped1, clamped2).toFixed(2);

  const polylinePoints = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x},${p.y}`).join(" ");

  const polygonPoints = [...graph1Pts, ...[...graph2Pts].reverse()]
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <Caption caption={caption}>
      <NarrowContainer width="50%">
        <ToggleSwitch
          leftText={`Largest Diff: ${lInfDistance}`}
          rightText={`Area: ${area}`}
          leftColor={COLORS.PURPLE}
          rightColor={COLORS.GRAY}
          handleSwitchChange={setL1NormActive}
        />
        <Graph
          graphPadding={PADDING}
          height={HEIGHT}
          svgId="function-distance-explorer"
          tickStep={() => 1}
          width={WIDTH}
          xScale={xScale}
          yScale={yScale}
        >
          {l1NormActive && (
            <polygon
              points={polygonPoints}
              fill={COLORS.GRAY}
              stroke="none"
              opacity={0.5}
            />
          )}
          {!l1NormActive && (
            <line
              x1={lInfSeg.x1}
              y1={lInfSeg.y1}
              x2={lInfSeg.x2}
              y2={lInfSeg.y2}
              stroke={COLORS.PURPLE}
              strokeWidth={4}
              strokeDasharray="8 4"
            />
          )}
          <polyline
            points={polylinePoints(graph1Pts)}
            fill="none"
            stroke={COLORS.ORANGE}
            strokeWidth={3}
          />
          <polyline
            points={polylinePoints(graph2Pts)}
            fill="none"
            stroke={COLORS.GREEN}
            strokeWidth={3}
          />
          {graph1Pts.map((pt, i) => (
            <DraggableCircle
              key={i}
              id={i}
              cx={pt.x}
              cy={pt.y}
              fill={COLORS.ORANGE}
              stroke={COLORS.ORANGE}
              onDrag={constrainedHandleDrag}
            />
          ))}
          {graph2Pts.map((pt, i) => (
            <DraggableCircle
              key={i + 3}
              id={i + 3}
              cx={pt.x}
              cy={pt.y}
              fill={COLORS.GREEN}
              stroke={COLORS.GREEN}
              onDrag={constrainedHandleDrag}
            />
          ))}
        </Graph>
      </NarrowContainer>
    </Caption>
  );
};

export default FunctionDistanceExplorer;
