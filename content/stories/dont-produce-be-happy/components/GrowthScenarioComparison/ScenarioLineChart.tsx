"use client";

import { scaleLinear } from "d3-scale";
import { curveLinear, line as d3Line } from "d3-shape";
import { animate } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Axis from "@/components/story/shared/Axis";
import AxisLabel from "@/components/story/shared/AxisLabel";
import Graph from "@/components/story/shared/Graph";
import {
  CHART_AXIS_FONT_SIZE,
  CHART_HEIGHT,
  CHART_PADDING,
  CHART_WIDTH,
  X_TICK_LABEL_POSITION,
  Y_TICK_LABEL_POSITION,
} from "../../constants";
import type { EurogreenScenario } from "../../data/csvData";

const X_DOMAIN: [number, number] = [2014, 2050];
const ANIMATION_DURATION = 0.4;

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
        .range([CHART_PADDING.left, CHART_WIDTH - CHART_PADDING.right]),
    [],
  );
  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain(yDomain)
        .range([CHART_HEIGHT - CHART_PADDING.bottom, CHART_PADDING.top]),
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
      graphPadding={CHART_PADDING}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      svgId={svgId}
      xScale={xScale}
      yScale={yScale}
      gridlinesHorizontal
      gridlinesVertical
    >
      <Axis
        key="y-axis"
        direction="y"
        scale={yScale}
        tickFormat={yTickFormat}
        labelPosition={Y_TICK_LABEL_POSITION}
        fontSize={CHART_AXIS_FONT_SIZE}
      />
      <Axis
        key="x-axis"
        direction="x"
        scale={xScale}
        tickFormat="d"
        rotateLabels={false}
        textAnchor="middle"
        labelPosition={X_TICK_LABEL_POSITION}
        fontSize={CHART_AXIS_FONT_SIZE}
      />
      <AxisLabel
        x={10}
        y={CHART_HEIGHT / 2}
        dy={10}
        transform={`rotate(-90 10,${CHART_HEIGHT / 2})`}
      >
        {yAxisLabel}
      </AxisLabel>
      <AxisLabel x={CHART_WIDTH / 2} y={CHART_HEIGHT - 8} anchor="middle">
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
