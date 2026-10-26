"use client";

import type { ScaleLinear } from "d3-scale";
import { motion } from "framer-motion";
import Legend from "@/components/story/shared/Legend";
import type { SliderData } from "@/hooks/useSliders";
import { REGION_LEGEND } from "../../data/data";
import ChartFrame from "../ChartFrame";

const TRANSITION_DURATION = 0.4;

export interface RegionScatterPoint {
  cx: number;
  cy: number;
  radius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  label: string;
  key: string;
  ariaLabel: string;
  tooltipBody: string[];
}

interface RegionScatterPlotProps {
  data: RegionScatterPoint[];
  sliderData: SliderData[];
  width: number;
  height: number;
  graphPadding: { top: number; bottom: number; left: number; right: number };
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  xTickFormat: string;
  yTickFormat: string;
  xAxisLabel: string;
  yAxisLabel: string;
  containerWidth: string;
}

export default function RegionScatterPlot({
  data,
  sliderData,
  width,
  height,
  graphPadding,
  xScale,
  yScale,
  xTickFormat,
  yTickFormat,
  xAxisLabel,
  yAxisLabel,
  containerWidth,
}: RegionScatterPlotProps) {
  return (
    <ChartFrame
      containerWidth={containerWidth}
      width={width}
      height={height}
      graphPadding={graphPadding}
      xScale={xScale}
      yScale={yScale}
      xTickFormat={xTickFormat}
      yTickFormat={yTickFormat}
      xAxisLabel={xAxisLabel}
      yAxisLabel={yAxisLabel}
      sliderData={sliderData}
      toolbar={<Legend labels={REGION_LEGEND} />}
    >
      {({ showTooltip, showTooltipAt, hideTooltip }) =>
        data.map((point) => (
          <motion.circle
            key={point.key}
            initial={false}
            animate={{
              cx: xScale(point.cx),
              cy: yScale(point.cy),
            }}
            transition={{ duration: TRANSITION_DURATION }}
            r={point.radius}
            fill={point.fill}
            stroke={point.stroke}
            strokeWidth={point.strokeWidth}
            opacity={point.opacity}
            className="cursor-default"
            role="button"
            tabIndex={0}
            aria-label={point.ariaLabel}
            onMouseEnter={showTooltip(point.label, point.tooltipBody)}
            onMouseLeave={hideTooltip}
            onFocus={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              showTooltipAt(
                point.label,
                point.tooltipBody,
                rect.left + rect.width / 2,
                rect.top,
              );
            }}
            onBlur={hideTooltip}
          />
        ))
      }
    </ChartFrame>
  );
}
