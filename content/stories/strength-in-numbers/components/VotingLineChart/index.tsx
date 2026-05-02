"use client";

import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Caption from "@/components/story/shared/Caption";
import Graph from "@/components/story/shared/Graph";
import LinePlot from "@/components/story/shared/LinePlot";
import Select from "@/components/story/shared/Select";
import type { VotingDataRow } from "../../data";
import { VOTERS_LINE_OPTIONS, WORKERS_LINE_OPTIONS } from "./constants";

const SVG_WIDTH = 900;
const SVG_HEIGHT = 600;
const GRAPH_PADDING = { top: 20, bottom: 100, left: 100, right: 20 };

const YEARS = [2008, 2010, 2012, 2014, 2016];

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
  const options = variant === "voters" ? VOTERS_LINE_OPTIONS : WORKERS_LINE_OPTIONS;
  const [selectedStat, setSelectedStat] = useState(options[0].value);
  const [selectedState, setSelectedState] = useState(states[0] ?? "");

  const statOptions = options.map((o) => ({ value: o.value, label: o.label }));
  const stateOptions = states.map((s, i) => ({ value: String(i), label: s }));

  const option = options.find((o) => o.value === selectedStat) ?? options[0];
  const color = option.color;

  const stateData = data
    .filter((d) => d.state === selectedState)
    .map((d) => ({ x: d.year, y: option.accessor(d) }))
    .filter((d): d is { x: number; y: number } => d.y !== null && d.y !== 0 && isFinite(d.y));

  const hasData = stateData.length > 0;

  const xScale = scaleLinear()
    .domain(extent(YEARS) as [number, number])
    .range([GRAPH_PADDING.left, SVG_WIDTH - GRAPH_PADDING.right]);

  const yScale = scaleLinear()
    .domain(hasData ? (extent(stateData, (d) => d.y) as [number, number]) : [0, 1])
    .range([SVG_HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

  const contentKey = `${selectedStat}-${selectedState}`;

  return (
    <Caption caption={caption}>
      <div className="space-y-3">
        <Select
          name="statistic"
          value={selectedStat}
          onChange={(opt) => setSelectedStat(opt.value)}
          options={statOptions}
        />
        <Select
          name="state"
          value={stateOptions.find((o) => o.label === selectedState)?.value ?? "0"}
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
            <AnimatePresence mode="wait">
              <motion.g
                key={contentKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <LinePlot
                  graphData={stateData}
                  stroke={color}
                  xScale={xScale}
                  yScale={yScale}
                  curve="curveLinear"
                />
                {stateData.map((d) => (
                  <circle
                    key={d.x}
                    cx={xScale(d.x) as number}
                    cy={yScale(d.y) as number}
                    r={10}
                    fill={color}
                  />
                ))}
              </motion.g>
            </AnimatePresence>
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
    </Caption>
  );
};

export default VotingLineChart;
