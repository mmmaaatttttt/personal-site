"use client";

import type { AxisScale } from "d3-axis";
import type { ScaleBand, ScaleLinear } from "d3-scale";
import { scaleBand, scaleLinear } from "d3-scale";
import { AnimatePresence } from "framer-motion";
import type { FC } from "react";
import { useMemo } from "react";
import { useIsMounted } from "@/hooks/useIsMounted";
import Graph from "../Graph";
import BarItem from "./BarItem";

interface BarData {
  key: string | number;
  height: number;
  color?: string;
  x0?: number; // For histogram
  x1?: number; // For histogram
}

interface BarGraphProps {
  animated?: boolean;
  barData: BarData[];
  barLabel?: (d: BarData) => string | number;
  color: string;
  height?: number;
  histogram?: boolean;
  labelFontSize?: string;
  padding?:
    | number
    | { top: number; bottom: number; left: number; right: number };
  svgId?: string;
  thresholds?: number[];
  tickFormat?: string;
  yTickLabelPosition?: "left" | "center";
  yLabelSide?: "left" | "right";
  gridlinesVertical?: boolean;
  labelDy?: number;
  tickFontSizeX?: string;
  yTickFormat?: string;
  tickStep?: number;
  tickStepX?: number;
  tickStepY?: number;
  width?: number;
  yScale: ScaleLinear<number, number>;
}

const BarGraph: FC<BarGraphProps> = ({
  animated = true,
  barData,
  barLabel,
  color,
  height = 600,
  histogram = false,
  labelFontSize,
  padding = 0,
  svgId = "bar-graph",
  thresholds,
  tickFormat,
  yTickLabelPosition = "left",
  yLabelSide = "left",
  gridlinesVertical = true,
  labelDy,
  tickFontSizeX,
  yTickFormat,
  tickStep,
  tickStepX,
  tickStepY,
  width = 600,
  yScale,
}) => {
  const isMounted = useIsMounted();
  const p =
    typeof padding === "number"
      ? { top: padding, bottom: padding, left: padding, right: padding }
      : padding;

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

  if (!isMounted)
    return (
      <div
        className="animate-pulse bg-nav/10"
        style={{ height, width: "100%" }}
      />
    );

  const fontSize =
    labelFontSize ||
    (barData.length < 11 ? "100%" : `${110 - 1 * barData.length}%`);

  return (
    <div className="w-full h-full">
      <Graph
        svgId={svgId}
        width={width}
        height={height}
        graphPadding={p}
        xScale={xScale as AxisScale<string | number>}
        yScale={yScale}
        tickFormatX={tickFormat}
        tickFormatY={yTickFormat}
        yAxisPosition={yTickLabelPosition}
        yLabelSide={yLabelSide}
        yAxisOnTop={yLabelSide === "right"}
        gridlinesVertical={gridlinesVertical}
        tickFontSizeX={tickFontSizeX}
        tickStepX={tickStepX ? () => tickStepX : undefined}
        tickStepY={
          tickStepY ? () => tickStepY : tickStep ? () => tickStep : undefined
        }
      >
        <g clipPath={`url(#clip-path-${svgId})`}>
          {(() => {
            const items = barData.map((d, i) => {
              let x: number;
              let barWidth: number;

              if (histogram) {
                const linearScale = xScale as ScaleLinear<number, number>;
                x = linearScale(d.x0 ?? 0) + 1;
                barWidth = linearScale(d.x1 ?? 0) - linearScale(d.x0 ?? 0) - 2;
              } else {
                const bandScale = xScale as ScaleBand<string>;
                x = bandScale(i.toString()) || 0;
                barWidth = bandScale.bandwidth();
              }

              const y = yScale(d.height);
              const barHeight = height - y - p.bottom;

              return (
                <BarItem
                  key={d.key}
                  data={d}
                  index={i}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  color={color}
                  graphHeight={height}
                  paddingBottom={p.bottom}
                  barLabel={barLabel}
                  fontSize={fontSize}
                  labelDy={labelDy}
                  animated={animated}
                />
              );
            });
            // AnimatePresence is only needed for animated=true (exit animations on bar removal).
            // For animated=false, React's key-based reconciliation immediately removes bars,
            // preventing ghost bars that would otherwise stack during the transition.
            return animated ? (
              <AnimatePresence initial={true}>{items}</AnimatePresence>
            ) : (
              items
            );
          })()}
        </g>
      </Graph>
    </div>
  );
};

export default BarGraph;
