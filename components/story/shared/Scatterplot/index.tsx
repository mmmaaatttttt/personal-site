"use client";

import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { AnimatePresence } from "framer-motion";
import type { FC } from "react";
import { useMemo } from "react";
import { useIsMounted } from "@/hooks/useIsMounted";
import Graph from "../Graph";
import ScatterPoint from "./ScatterPoint";

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
  tickFontSizeX?: string;
  tickFontSizeY?: string;
}

const Scatterplot: FC<ScatterplotProps> = ({
  data,
  width = 600,
  height = 600,
  graphPadding = 0,
  svgId = "scatterplot",
  xLabel = "",
  yLabel = "",
  tickFormatX,
  tickFormatY,
  tickFontSizeX,
  tickFontSizeY,
}) => {
  const isMounted = useIsMounted();

  const xScale = useMemo(() => {
    if (!isMounted) return scaleLinear();
    const domain = extent(data, (d) => d.cx) as [number, number];
    return scaleLinear()
      .domain(domain || [0, 1])
      .range([graphPadding, width - graphPadding]);
  }, [data, graphPadding, width, isMounted]);

  const yScale = useMemo(() => {
    if (!isMounted) return scaleLinear();
    const domain = extent(data, (d) => d.cy) as [number, number];
    return scaleLinear()
      .domain(domain || [0, 1])
      .range([height - graphPadding, graphPadding]);
  }, [data, graphPadding, height, isMounted]);

  if (!isMounted)
    return (
      <div
        className="animate-pulse bg-nav/10"
        style={{ height, width: "100%" }}
      />
    );

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
        tickFontSizeX={tickFontSizeX}
        tickFontSizeY={tickFontSizeY}
      >
        <g>
          <AnimatePresence>
            {data.map((d, i) => (
              <ScatterPoint
                key={d.key}
                cx={xScale(d.cx) || 0}
                cy={yScale(d.cy) || 0}
                area={d.area}
                fill={d.fill}
                index={i}
              />
            ))}
          </AnimatePresence>
        </g>
      </Graph>
    </div>
  );
};

export default Scatterplot;
