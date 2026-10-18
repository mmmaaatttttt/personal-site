"use client";

import { scaleLinear } from "d3-scale";
import { curveLinear, line as d3Line } from "d3-shape";
import { animate } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Axis from "@/components/story/shared/Axis";
import AxisLabel from "@/components/story/shared/AxisLabel";
import Graph from "@/components/story/shared/Graph";
import COLORS from "@/utils/styles";
import type { EurogreenScenario } from "../../data/csvData";

const WIDTH = 700;
const HEIGHT = 450;
const GRAPH_PADDING = { top: 20, bottom: 50, left: 90, right: 20 };
const AXIS_FONT = "14px";
const X_DOMAIN: [number, number] = [2014, 2050];
const ANIMATION_DURATION = 0.4;

const SIMULATION_START_YEAR = 2020;

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
  yTickFormat: string;
}

export default function ScenarioLineChart({
  svgId,
  series,
  yDomain,
  yAxisLabel,
  yTickFormat,
}: ScenarioLineChartProps) {
  const xScale = useMemo(
    () =>
      scaleLinear()
        .domain(X_DOMAIN)
        .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]),
    [],
  );
  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain(yDomain)
        .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]),
    [yDomain],
  );

  const animYRef = useRef<Record<string, number>>({});
  const [, setTick] = useState(0);

  useEffect(() => {
    const controls: ReturnType<typeof animate>[] = [];

    for (const { scenario, data } of series) {
      for (const point of data) {
        const key = `${scenario}-${point.x}`;
        const targetY = yScale(point.y) as number;
        const fromY = animYRef.current[key] ?? targetY;

        controls.push(
          animate(fromY, targetY, {
            duration: ANIMATION_DURATION,
            ease: "easeInOut",
            onUpdate: (value) => {
              animYRef.current[key] = value;
              setTick((tick) => tick + 1);
            },
          }),
        );
      }
    }

    return () => {
      for (const control of controls) control?.stop();
    };
  }, [series, yScale]);

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
      <rect
        x={GRAPH_PADDING.left}
        y={GRAPH_PADDING.top}
        width={(xScale(SIMULATION_START_YEAR) as number) - GRAPH_PADDING.left}
        height={HEIGHT - GRAPH_PADDING.top - GRAPH_PADDING.bottom}
        fill={COLORS.LIGHT_GRAY}
      />
      <Axis
        key="y-axis"
        direction="y"
        scale={yScale}
        tickFormat={yTickFormat}
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
      {series.map(({ scenario, color, data }) => {
        const linePath = d3Line<{ x: number; y: number }>()
          .x((point) => xScale(point.x) as number)
          .y(
            (point) =>
              animYRef.current[`${scenario}-${point.x}`] ??
              (yScale(point.y) as number),
          )
          .curve(curveLinear)(data);

        return (
          <path
            key={scenario}
            d={linePath ?? ""}
            stroke={color}
            strokeWidth={5}
            fill="none"
          />
        );
      })}
    </Graph>
  );
}
