"use client";

import type { ScaleLinear } from "d3-scale";
import type { ReactNode } from "react";
import Axis from "@/components/story/shared/Axis";
import AxisLabel from "@/components/story/shared/AxisLabel";
import Graph from "@/components/story/shared/Graph";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import Tooltip, { useTooltip } from "@/components/story/shared/Tooltip";
import type { SliderData } from "@/hooks/useSliders";

const DEFAULT_AXIS_FONT_SIZE = "11px";

interface ChartFrameTooltipHelpers {
  showTooltip: ReturnType<typeof useTooltip>["showTooltip"];
  showTooltipAt: ReturnType<typeof useTooltip>["showTooltipAt"];
  hideTooltip: ReturnType<typeof useTooltip>["hideTooltip"];
}

interface ChartFrameProps {
  containerWidth: string;
  fullWidthAt?: "sm" | "md" | "lg" | "xl";
  width: number;
  height: number;
  graphPadding: { top: number; bottom: number; left: number; right: number };
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  xTickFormat: string;
  yTickFormat: string;
  xAxisLabel: ReactNode;
  yAxisLabel: ReactNode;
  axisFontSize?: string;
  sliderData: SliderData[];
  toolbar?: ReactNode;
  children: (tooltip: ChartFrameTooltipHelpers) => ReactNode;
}

export default function ChartFrame({
  containerWidth,
  fullWidthAt = "lg",
  width,
  height,
  graphPadding,
  xScale,
  yScale,
  xTickFormat,
  yTickFormat,
  xAxisLabel,
  yAxisLabel,
  axisFontSize = DEFAULT_AXIS_FONT_SIZE,
  sliderData,
  toolbar,
  children,
}: ChartFrameProps) {
  const { tooltip, showTooltip, showTooltipAt, hideTooltip } = useTooltip();

  return (
    <NarrowContainer width={containerWidth} fullWidthAt={fullWidthAt}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full">
          <SliderGroup data={sliderData} />
        </div>
        {toolbar}
        <Graph
          axes={false}
          graphPadding={graphPadding}
          width={width}
          height={height}
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
            fontSize={axisFontSize}
          />
          <Axis
            key="x-axis"
            direction="x"
            scale={xScale}
            tickFormat={xTickFormat}
            rotateLabels={false}
            textAnchor="middle"
            labelPosition={{ dy: "0.71em" }}
            fontSize={axisFontSize}
          />
          <AxisLabel
            x={10}
            y={height / 2}
            dy={10}
            transform={`rotate(-90 10,${height / 2})`}
          >
            {yAxisLabel}
          </AxisLabel>
          <AxisLabel x={width / 2} y={height - 8} anchor="middle">
            {xAxisLabel}
          </AxisLabel>
          {children({ showTooltip, showTooltipAt, hideTooltip })}
        </Graph>
      </div>
      <Tooltip info={tooltip} />
    </NarrowContainer>
  );
}
