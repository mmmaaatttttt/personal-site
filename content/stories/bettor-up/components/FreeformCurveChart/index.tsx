"use client";

import { scaleLinear } from "d3-scale";
import Axis from "@/components/story/shared/Axis";
import Graph from "@/components/story/shared/Graph";
import LinePlot from "@/components/story/shared/LinePlot";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { Button } from "@/components/ui/Button";
import COLORS from "@/utils/styles";
import useFreeformCurveChart from "./useFreeformCurveChart";
import { toDomainCoords } from "./utils";

const WIDTH = 500;
const HEIGHT = 500;
const PADDING = { top: 30, bottom: 80, left: 75, right: 30 };
const CONTAINER_WIDTH = "50%";
const CROSSING_RADIUS = 7;

const xScale = scaleLinear()
  .domain([0, 1])
  .range([PADDING.left, WIDTH - PADDING.right]);
const yScale = scaleLinear()
  .domain([0, 1])
  .range([HEIGHT - PADDING.bottom, PADDING.top]);
const diagonalData = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
];

export default function FreeformCurveChart() {
  const {
    curvePoints,
    crossings,
    handleDrawStart,
    handleDrawMove,
    handleDrawEnd,
    reset,
  } = useFreeformCurveChart();

  return (
    <NarrowContainer width={CONTAINER_WIDTH}>
      <div className="flex flex-col items-center gap-4">
        <Graph
          xScale={xScale}
          yScale={yScale}
          width={WIDTH}
          height={HEIGHT}
          graphPadding={PADDING}
          axes={false}
          xLabel="Contract Price"
          yLabel="Event Probability at Given Price"
        >
          <Axis key="y-axis" direction="y" scale={yScale} tickFormat=".1f" />
          <Axis
            key="x-axis"
            direction="x"
            scale={xScale}
            tickFormat=".1f"
            rotateLabels={false}
            textAnchor="middle"
            labelPosition={{ dy: "1.4em" }}
          />
          <LinePlot
            graphData={diagonalData}
            xScale={xScale}
            yScale={yScale}
            curve="curveLinear"
            stroke={COLORS.GRAY}
            strokeWidth={2}
          />
          <LinePlot
            graphData={curvePoints}
            xScale={xScale}
            yScale={yScale}
            curve="curveLinear"
            stroke={COLORS.BLUE}
            strokeWidth={3}
          />
          {crossings.map((crossing) => (
            <circle
              key={crossing.probability}
              cx={xScale(crossing.probability)}
              cy={yScale(crossing.probability)}
              r={CROSSING_RADIUS}
              fill={COLORS.DARK_GREEN}
            />
          ))}
          <rect
            x={PADDING.left}
            y={PADDING.top}
            width={WIDTH - PADDING.left - PADDING.right}
            height={HEIGHT - PADDING.top - PADDING.bottom}
            fill="transparent"
            style={{ cursor: "crosshair", touchAction: "none" }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              const coords = toDomainCoords(e, xScale, yScale);
              if (coords) handleDrawStart(coords.x, coords.y);
            }}
            onPointerMove={(e) => {
              const coords = toDomainCoords(e, xScale, yScale);
              if (coords) handleDrawMove(coords.x, coords.y);
            }}
            onPointerUp={handleDrawEnd}
            onPointerCancel={handleDrawEnd}
          />
        </Graph>
        <Button onClick={reset} variant="outline" size="sm">
          Reset
        </Button>
      </div>
    </NarrowContainer>
  );
}
