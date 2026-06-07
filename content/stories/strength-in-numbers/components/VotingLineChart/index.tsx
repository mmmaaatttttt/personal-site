"use client";

import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { curveLinear, line as d3Line } from "d3-shape";
import { animate } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Figure from "@/components/story/shared/Figure";
import Graph from "@/components/story/shared/Graph";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Select from "@/components/story/shared/Select";
import type { VotingDataRow } from "../../data";
import { VOTERS_LINE_OPTIONS, WORKERS_LINE_OPTIONS } from "./constants";

const SVG_WIDTH = 900;
const SVG_HEIGHT = 600;
const GRAPH_PADDING = { top: 20, bottom: 100, left: 100, right: 20 };
const YEARS = [2008, 2010, 2012, 2014, 2016];
const BOTTOM_Y = SVG_HEIGHT - GRAPH_PADDING.bottom;

interface VotingLineChartProps {
  data: VotingDataRow[];
  states: string[];
  variant: "voters" | "workers";
  svgId?: string;
  caption?: string;
}

const VotingLineChart = ({
  data,
  states,
  variant,
  svgId = "state-line-graph",
  caption,
}: VotingLineChartProps) => {
  const options =
    variant === "voters" ? VOTERS_LINE_OPTIONS : WORKERS_LINE_OPTIONS;
  const [selectedStat, setSelectedStat] = useState(options[0].value);
  const [selectedState, setSelectedState] = useState(states[0] ?? "");

  const statOptions = options.map((o) => ({ value: o.value, label: o.label }));
  const stateOptions = states.map((s, i) => ({ value: String(i), label: s }));

  const option = useMemo(
    () => options.find((o) => o.value === selectedStat) ?? options[0],
    [options, selectedStat],
  );
  const color = option.color;

  const stateData = useMemo(
    () =>
      data
        .filter((d) => d.state === selectedState)
        .map((d) => ({ x: d.year, y: option.accessor(d) }))
        .filter(
          (d): d is { x: number; y: number } =>
            d.y !== null && d.y !== 0 && Number.isFinite(d.y),
        ),
    [data, selectedState, option],
  );

  const hasData = stateData.length > 0;

  const xScale = useMemo(
    () =>
      scaleLinear()
        .domain(extent(YEARS) as [number, number])
        .range([GRAPH_PADDING.left, SVG_WIDTH - GRAPH_PADDING.right]),
    [],
  );

  const yScale = useMemo(() => {
    if (!hasData) {
      return scaleLinear()
        .domain([0, 1])
        .range([SVG_HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);
    }
    const [yMin, yMax] = extent(stateData, (d) => d.y) as [number, number];
    const domain = yMin === yMax ? [yMin * 0.9, yMax * 1.1] : [yMin, yMax];
    return scaleLinear()
      .domain(domain)
      .range([SVG_HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);
  }, [stateData, hasData]);

  // Per-year animated pixel positions. Both the line path and the circles are
  // derived from these on each render tick, keeping them perfectly in sync.
  const animCyRef = useRef<Record<number, number>>(
    Object.fromEntries(YEARS.map((y) => [y, BOTTOM_Y])),
  );
  const animOpacityRef = useRef<Record<number, number>>(
    Object.fromEntries(YEARS.map((y) => [y, 0])),
  );
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!hasData) return;

    const controls: (ReturnType<typeof animate> | undefined)[] = [];

    YEARS.forEach((year, _idx) => {
      const point = stateData.find((d) => d.x === year);
      const targetCy = point ? (yScale(point.y) as number) : BOTTOM_Y;
      const targetOpacity = point ? 1 : 0;

      controls.push(
        animate(animCyRef.current[year] ?? BOTTOM_Y, targetCy, {
          duration: 0.35,
          ease: "easeInOut",
          onUpdate: (v) => {
            animCyRef.current[year] = v;
            setTick((n) => n + 1);
          },
        }),
      );

      controls.push(
        animate(animOpacityRef.current[year] ?? 0, targetOpacity, {
          duration: 0.35,
          ease: "easeInOut",
          onUpdate: (v) => {
            animOpacityRef.current[year] = v;
          },
        }),
      );
    });

    return () =>
      controls.forEach((c) => {
        c?.stop();
      });
  }, [stateData, hasData, yScale]);

  // Build the line path from the animated cy values so it moves in lockstep
  // with the circles. Filter out years whose opacity is near zero so the path
  // doesn't include invisible phantom points.
  const visibleYears = YEARS.filter(
    (year) => (animOpacityRef.current[year] ?? 0) > 0.01,
  );
  const linePath =
    visibleYears.length > 0
      ? (d3Line<number>()
          .x((year) => xScale(year) as number)
          .y((year) => animCyRef.current[year] ?? BOTTOM_Y)
          .curve(curveLinear)(visibleYears) ?? "")
      : "";

  return (
    <Figure caption={caption}>
      <NarrowContainer width="77%">
        <div className="space-y-3">
          <Select
            name="statistic"
            value={selectedStat}
            onChange={(opt) => setSelectedStat(opt.value)}
            options={statOptions}
          />
          <Select
            name="state"
            value={
              stateOptions.find((o) => o.label === selectedState)?.value ?? "0"
            }
            onChange={(opt) => setSelectedState(opt.label)}
            options={stateOptions}
          />
          {hasData ? (
            <Graph
              width={SVG_WIDTH}
              height={SVG_HEIGHT}
              svgPadding={0}
              graphPadding={GRAPH_PADDING}
              svgId={svgId}
              xLabel="Year"
              xScale={xScale}
              yScale={yScale}
              yLabel={option.label}
              yLabelOffset={40}
              tickFormatX=".0f"
              tickFormatY={option.format}
            >
              <path d={linePath} stroke={color} strokeWidth={5} fill="none" />
              {YEARS.map((year) => (
                <circle
                  key={year}
                  cx={xScale(year) as number}
                  cy={animCyRef.current[year] ?? BOTTOM_Y}
                  r={10}
                  fill={color}
                  opacity={animOpacityRef.current[year] ?? 0}
                />
              ))}
            </Graph>
          ) : (
            <>
              <p />
              <h4 className="text-lg font-bold">
                {option.label} data not available in {selectedState}.
              </h4>
              <p>Please explore a different option.</p>
            </>
          )}
        </div>
      </NarrowContainer>
    </Figure>
  );
};

export default VotingLineChart;
