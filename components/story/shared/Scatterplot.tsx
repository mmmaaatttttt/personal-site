"use client";

import React, { useMemo } from "react";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { motion, AnimatePresence } from "framer-motion";
import Graph from "./Graph";

interface ScatterplotData {
  cx: number;
  cy: number;
  area: number;
  fill: string;
  key: string;
}

interface ScatterplotProps {
  data: ScatterplotData[];
  width?: number;
  height?: number;
  graphPadding?: number;
  svgId?: string;
  xLabel?: string;
  yLabel?: string;
  tickFormatX?: string;
  tickFormatY?: string;
}

const Scatterplot: React.FC<ScatterplotProps> = ({
  data,
  width = 600,
  height = 600,
  graphPadding = 0,
  svgId = "scatterplot",
  xLabel = "",
  yLabel = "",
  tickFormatX = "",
  tickFormatY = "",
}) => {
  const xScale = useMemo(() => {
    const domain = extent(data, (d) => d.cx) as [number, number];
    return scaleLinear()
      .domain(domain)
      .range([graphPadding, width - graphPadding]);
  }, [data, graphPadding, width]);

  const yScale = useMemo(() => {
    const domain = extent(data, (d) => d.cy) as [number, number];
    return scaleLinear()
      .domain(domain)
      .range([height - graphPadding, graphPadding]);
  }, [data, graphPadding, height]);

  return (
    <div className="w-full">
      <Graph
        svgId={svgId}
        width={width}
        height={height}
        graphPadding={graphPadding}
        xLabel={xLabel}
        yLabel={yLabel}
        xScale={xScale}
        yScale={yScale}
        tickFormatX={tickFormatX}
        tickFormatY={tickFormatY}
      >
        <g>
          <AnimatePresence>
            {data.map((d, i) => (
              <motion.circle
                key={d.key}
                initial={{ r: 0, cx: xScale(d.cx), cy: yScale(d.cy) }}
                animate={{
                  r: Math.sqrt(d.area),
                  cx: xScale(d.cx),
                  cy: yScale(d.cy),
                  fill: d.fill,
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.002, // Replicating the legacy staggered delay
                }}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth={1}
                // Optional: add a slight hover effect
                whileHover={{ strokeWidth: 2, stroke: "rgba(0,0,0,0.5)" }}
              />
            ))}
          </AnimatePresence>
        </g>
      </Graph>
    </div>
  );
};

export default Scatterplot;
