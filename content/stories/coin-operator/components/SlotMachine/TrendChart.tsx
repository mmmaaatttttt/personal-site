"use client";

import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { curveLinear, line as d3Line } from "d3-shape";
import { animate } from "framer-motion";
import { type FC, useEffect, useMemo, useRef, useState } from "react";
import Graph from "@/components/story/shared/Graph";
import Select from "@/components/story/shared/Select";
import {
  type RoundRecord,
  SERIES_OPTIONS,
  type SeriesOption,
} from "./constants";
import { niceIntegerTickStep } from "./niceIntegerTickStep";

const SVG_WIDTH = 700;
const SVG_HEIGHT = 400;
const GRAPH_PADDING = { top: 20, bottom: 60, left: 60, right: 20 };
const BOTTOM_Y = SVG_HEIGHT - GRAPH_PADDING.bottom;
const TRANSITION_DURATION = 0.5;
const X_TICK_COUNT = 10;
const Y_TICK_COUNT = 8;

interface Point {
  round: number;
  value: number;
}

interface TrendChartProps {
  history: RoundRecord[];
}

const TrendChart: FC<TrendChartProps> = ({ history }) => {
  const [selected, setSelected] = useState<SeriesOption>(SERIES_OPTIONS[0]);

  const points = useMemo<Point[]>(
    () => [
      { round: 0, value: 0 },
      ...history.map((h) => ({ round: h.round, value: h[selected.value] })),
    ],
    [history, selected],
  );

  const maxRound = Math.max(history.length, 1);

  const xScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, maxRound])
        .range([GRAPH_PADDING.left, SVG_WIDTH - GRAPH_PADDING.right]),
    [maxRound],
  );

  const yScale = useMemo(() => {
    const [min, max] = extent(points, (d) => d.value) as [number, number];
    const domain = min === max ? [min - 1, max + 1] : [min, max];
    return scaleLinear().domain(domain).range([BOTTOM_Y, GRAPH_PADDING.top]);
  }, [points]);

  // Per-round animated pixel positions. The line and circles are both
  // derived from these on each render tick, keeping them perfectly in sync.
  const animYRef = useRef<Record<number, number>>({});
  const [, setTick] = useState(0);

  useEffect(() => {
    const controls = points.map(({ round, value }) => {
      const target = yScale(value) as number;
      return animate(animYRef.current[round] ?? BOTTOM_Y, target, {
        duration: TRANSITION_DURATION,
        ease: "easeInOut",
        onUpdate: (v) => {
          animYRef.current[round] = v;
          setTick((n) => n + 1);
        },
      });
    });

    return () =>
      controls.forEach((c) => {
        c?.stop();
      });
  }, [points, yScale]);

  const linePath =
    d3Line<Point>()
      .x((d) => xScale(d.round) as number)
      .y((d) => animYRef.current[d.round] ?? BOTTOM_Y)
      .curve(curveLinear)(points) ?? "";

  return (
    <div className="space-y-3">
      <Select
        name="series"
        value={selected.value}
        onChange={(opt) => setSelected(opt)}
        options={SERIES_OPTIONS}
      />
      <Graph
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        graphPadding={GRAPH_PADDING}
        xScale={xScale}
        yScale={yScale}
        xLabel="Round"
        yLabel={selected.label}
        tickFormatX=",.0f"
        tickFormatY=",.0f"
        tickStepX={(scale) => {
          const [min, max] = scale.domain() as [number, number];
          return niceIntegerTickStep(min, max, X_TICK_COUNT);
        }}
        tickStepY={(scale) => {
          const [min, max] = scale.domain() as [number, number];
          return niceIntegerTickStep(min, max, Y_TICK_COUNT);
        }}
      >
        <path
          d={linePath}
          stroke={selected.color}
          strokeWidth={5}
          fill="none"
        />
        {points.map(({ round }) => (
          <circle
            key={round}
            cx={xScale(round) as number}
            cy={animYRef.current[round] ?? BOTTOM_Y}
            r={6}
            fill={selected.color}
          />
        ))}
      </Graph>
    </div>
  );
};

export default TrendChart;
