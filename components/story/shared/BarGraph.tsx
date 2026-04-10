import React, { useState, useMemo, useEffect } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import type { ScaleLinear, ScaleBand } from "d3-scale";
import { motion, AnimatePresence } from "framer-motion";
import Graph from "./Graph";

interface BarData {
  key: string | number;
  height: number;
  color?: string;
  x0?: number; // For histogram
  x1?: number; // For histogram
}

interface BarGraphProps {
  barData: BarData[];
  barLabel?: (d: BarData) => string | number;
  color: string;
  height?: number;
  histogram?: boolean;
  labelFontSize?: string;
  padding?: number | { top: number; bottom: number; left: number; right: number };
  svgId?: string;
  thresholds?: number[];
  tickFormat?: string;
  yTickLabelPosition?: "left" | "center";
  yTickFormat?: string;
  tickStep?: number;
  tickStepX?: number;
  tickStepY?: number;
  width?: number;
  yScale: ScaleLinear<number, number>;
}

const BarGraph: React.FC<BarGraphProps> = ({
  barData,
  barLabel,
  color,
  height = 600,
  histogram = false,
  labelFontSize,
  padding = 0,
  svgId = "bar-graph",
  thresholds,
  tickFormat = "",
  yTickLabelPosition = "left",
  yTickFormat = "",
  tickStep,
  tickStepX,
  tickStepY,
  width = 600,
  yScale,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const p = typeof padding === "number" ? { top: padding, bottom: padding, left: padding, right: padding } : padding;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const xScale = useMemo(() => {
    if (histogram && thresholds) {
      return scaleLinear()
        .domain([thresholds[0], thresholds[thresholds.length - 1]])
        .rangeRound([p.left, width - p.right]);
    }
    return scaleBand()
      .domain(barData.map((_, i) => i.toString()))
      .rangeRound([p.left, width - p.right])
      .padding(0.1);
  }, [histogram, thresholds, barData, p.left, p.right, width]);

  if (!isMounted) return <div className="animate-pulse bg-nav/10" style={{ height, width: "100%" }} />;

  const fontSize = labelFontSize || (barData.length < 11 ? "100%" : `${110 - 1 * barData.length}%`);

  return (
    <div className="w-full h-full">
      <Graph
        svgId={svgId}
        width={width}
        height={height}
        graphPadding={p}
        xScale={xScale}
        yScale={yScale}
        tickFormatX={tickFormat}
        tickFormatY={yTickFormat}
        yAxisPosition={yTickLabelPosition}
        tickStepX={tickStepX ? () => tickStepX : undefined}
        tickStepY={tickStepY ? () => tickStepY : (tickStep ? () => tickStep : undefined)}
      >
        <g clipPath={`url(#clip-path-${svgId})`}>
          <AnimatePresence>
            {barData.map((d, i) => {
              let x: number;
              let barWidth: number;

              if (histogram) {
                const linearScale = xScale as ScaleLinear<number, number>;
                x = linearScale(d.x0!) + 1;
                barWidth = linearScale(d.x1!) - linearScale(d.x0!) - 2;
              } else {
                const bandScale = xScale as ScaleBand<string>;
                x = bandScale(i.toString()) || 0;
                barWidth = bandScale.bandwidth();
              }

              const y = yScale(d.height);
              const barHeight = height - y - p.bottom;

              return (
                <g key={d.key}>
                  <motion.rect
                    initial={{ height: 0, y: height - p.bottom }}
                    animate={{ x, width: barWidth, y, height: barHeight, fill: d.color || color }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth={1}
                  />
                  {barLabel && (
                    <motion.text
                      x={x + barWidth / 2}
                      y={y}
                      dy={-12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={fontSize}
                      className="fill-current font-medium pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                    >
                      {barLabel(d)}
                    </motion.text>
                  )}
                </g>
              );
            })}
          </AnimatePresence>
        </g>
      </Graph>
    </div>
  );
};

export default BarGraph;
