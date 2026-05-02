"use client";

import { max } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import { AnimatePresence, motion } from "framer-motion";
import type { FC } from "react";
import ClippedSVG from "../ClippedSVG";
import NarrowContainer from "../NarrowContainer";

interface HorizontalBarData {
  caption: string;
  fill: string;
  width: number;
}

interface HorizontalBarGraphProps {
  containerWidth?: string | number;
  data: HorizontalBarData[];
  height?: number;
  id?: string;
  padding?:
    | number
    | { top: number; bottom: number; left: number; right: number };
  width?: number;
}

const HorizontalBarGraph: FC<HorizontalBarGraphProps> = ({
  containerWidth = "100%",
  data = [],
  height = 600,
  id = "horizontal-bar-graph",
  padding = 0,
  width = 600,
}) => {
  const p =
    typeof padding === "number"
      ? { top: padding, bottom: padding, left: padding, right: padding }
      : padding;
  const absXMax = max(data, (d) => Math.abs(d.width)) || 1;
  const xScale = scaleLinear()
    .domain([-absXMax, absXMax])
    .range([p.left, width - p.right]);
  const yScale = scaleBand()
    .domain(data.map((_, i) => i.toString()))
    .rangeRound([p.top, height - p.bottom]);

  return (
    <NarrowContainer width={containerWidth.toString()} className="w-full">
      <ClippedSVG id={id} width={width} height={height}>
        <g>
          <AnimatePresence>
            {data.map((d, i) => {
              const rectX = xScale(Math.min(d.width, 0));
              const rectWidth = xScale(Math.abs(d.width)) - xScale(0);
              const rectHeight = yScale.step() * 0.9;
              const rectY = (yScale(i.toString()) || 0) + yScale.step() * 0.1;

              return (
                <g
                  key={d.caption}
                  className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <motion.rect
                    initial={{ width: 0, x: xScale(0) }}
                    animate={{
                      x: rectX,
                      width: rectWidth,
                      y: rectY,
                      height: rectHeight,
                      fill: d.fill,
                    }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />
                  <motion.text
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    x={xScale(0)}
                    y={yScale(i.toString())}
                    fill={d.fill}
                    dominantBaseline="middle"
                    dy={yScale.step() * 0.53}
                    dx={-1 * Math.sign(d.width) * 5}
                    textAnchor={d.width < 0 ? "start" : "end"}
                    className="font-medium text-sm pointer-events-none"
                  >
                    {d.caption}
                  </motion.text>
                  <motion.text
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    x={xScale(d.width)}
                    y={(yScale(i.toString()) || 0) + yScale.step() * 0.1}
                    fill="#ffffff"
                    dominantBaseline="middle"
                    dy={yScale.step() * 0.54}
                    dx={-1 * Math.sign(d.width) * 5}
                    textAnchor={d.width < 0 ? "start" : "end"}
                    className="font-medium text-xs pointer-events-none drop-shadow-sm"
                  >
                    {Math.abs(d.width).toFixed(1)}
                  </motion.text>
                </g>
              );
            })}
          </AnimatePresence>
          <line
            x1={xScale(0)}
            x2={xScale(0)}
            y1={p.top}
            y2={height - p.bottom}
            stroke="#1a1a1a"
            strokeWidth={3}
          />
        </g>
      </ClippedSVG>
    </NarrowContainer>
  );
};

export default HorizontalBarGraph;
