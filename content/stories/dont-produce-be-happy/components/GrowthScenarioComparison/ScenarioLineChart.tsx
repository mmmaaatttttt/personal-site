"use client";

import { scaleLinear } from "d3-scale";
import Axis from "@/components/story/shared/Axis";
import AxisLabel from "@/components/story/shared/AxisLabel";
import Graph from "@/components/story/shared/Graph";
import LinePlot from "@/components/story/shared/LinePlot";
import type { EurogreenScenario } from "../../data/csvData";

const WIDTH = 800;
const HEIGHT = 600;
const GRAPH_PADDING = { top: 20, bottom: 50, left: 60, right: 20 };
const AXIS_FONT = "11px";
const X_DOMAIN: [number, number] = [2014, 2050];

interface ScenarioSeries {
  scenario: EurogreenScenario;
  color: string;
  data: { x: number; y: number }[];
}

interface ScenarioLineChartProps {
  svgId: string;
  series: ScenarioSeries[];
  yDomain: [number, number];
  yAxisLabel: string;
}

export default function ScenarioLineChart({
  svgId,
  series,
  yDomain,
  yAxisLabel,
}: ScenarioLineChartProps) {
  const xScale = scaleLinear()
    .domain(X_DOMAIN)
    .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);
  const yScale = scaleLinear()
    .domain(yDomain)
    .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

  return (
    <Graph
      axes={false}
      graphPadding={GRAPH_PADDING}
      width={WIDTH}
      height={HEIGHT}
      svgId={svgId}
      xScale={xScale}
      yScale={yScale}
      gridlinesHorizontal
      gridlinesVertical={false}
    >
      <Axis
        key="y-axis"
        direction="y"
        scale={yScale}
        tickFormat=","
        fontSize={AXIS_FONT}
      />
      <Axis
        key="x-axis"
        direction="x"
        scale={xScale}
        tickFormat="d"
        rotateLabels={false}
        textAnchor="middle"
        labelPosition={{ dy: "0.71em" }}
        fontSize={AXIS_FONT}
      />
      <AxisLabel
        x={10}
        y={HEIGHT / 2}
        dy={10}
        transform={`rotate(-90 10,${HEIGHT / 2})`}
      >
        {yAxisLabel}
      </AxisLabel>
      <AxisLabel x={WIDTH / 2} y={HEIGHT - 8} anchor="middle">
        Year
      </AxisLabel>
      {series.map(({ scenario, color, data }) => (
        <LinePlot
          key={scenario}
          graphData={data}
          stroke={color}
          strokeWidth={2}
          curve="curveLinear"
        />
      ))}
    </Graph>
  );
}
