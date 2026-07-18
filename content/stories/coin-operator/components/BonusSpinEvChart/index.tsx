"use client";

import type { FC } from "react";
import Axis from "@/components/story/shared/Axis";
import AxisLabel from "@/components/story/shared/AxisLabel";
import Graph from "@/components/story/shared/Graph";
import Legend from "@/components/story/shared/Legend";
import LinePlot from "@/components/story/shared/LinePlot";
import { SliderGroup } from "@/components/story/shared/Slider";
import Tooltip from "@/components/story/shared/Tooltip";
import {
  BOUNDED_COLOR,
  BOUNDED_LABEL,
  DOT_RADIUS,
  GRAPH_PADDING,
  HEIGHT,
  OPTIMAL_COLOR,
  OPTIMAL_LABEL,
  WIDTH,
} from "./constants";
import TooltipDots from "./TooltipDots";
import { useBonusSpinEvChart } from "./useBonusSpinEvChart";

const BonusSpinEvChart: FC = () => {
  const {
    sliderData,
    xScale,
    yScale,
    xTickValues,
    yTickValues,
    optimalCurve,
    optimalGraphData,
    boundedCurve,
    boundedLinePath,
    animatedBoundedY,
    tooltipData,
    isRecalculating,
    tooltip,
    showTooltip,
    showTooltipAt,
    hideTooltip,
  } = useBonusSpinEvChart();

  return (
    <div>
      <SliderGroup data={sliderData} />
      <Legend
        labels={[
          { text: OPTIMAL_LABEL, color: OPTIMAL_COLOR },
          { text: BOUNDED_LABEL, color: BOUNDED_COLOR },
        ]}
      />
      <Graph
        axes={false}
        graphPadding={GRAPH_PADDING}
        height={HEIGHT}
        width={WIDTH}
        svgId="bonus-spin-ev-chart"
        xScale={xScale}
        yScale={yScale}
      >
        <Axis
          key="y-axis"
          direction="y"
          scale={yScale}
          tickFormat=",.0f"
          tickValues={yTickValues}
        />
        <Axis
          key="x-axis"
          direction="x"
          scale={xScale}
          tickFormat=",.0f"
          tickValues={xTickValues}
        />
        <AxisLabel x={WIDTH / 2} y={HEIGHT - 10}>
          Number of Bonus Spins
        </AxisLabel>
        <AxisLabel
          x={10}
          y={HEIGHT / 2}
          dy={10}
          transform={`rotate(-90 10,${HEIGHT / 2})`}
        >
          Expected Value
        </AxisLabel>

        <path
          d={boundedLinePath}
          stroke={BOUNDED_COLOR}
          strokeWidth={2}
          fill="none"
          className="transition-opacity duration-300"
          style={{ opacity: isRecalculating ? 0.4 : 1 }}
        />
        <g
          className="transition-opacity duration-300"
          style={{ opacity: isRecalculating ? 0.4 : 1 }}
        >
          <TooltipDots
            curve={boundedCurve}
            color={BOUNDED_COLOR}
            dotRadius={DOT_RADIUS}
            xScale={xScale}
            yScale={yScale}
            animatedCy={animatedBoundedY}
            tooltipData={tooltipData}
            showTooltip={showTooltip}
            showTooltipAt={showTooltipAt}
            hideTooltip={hideTooltip}
          />
        </g>

        <LinePlot
          graphData={optimalGraphData}
          stroke={OPTIMAL_COLOR}
          strokeWidth={2}
          curve="curveLinear"
        />
        <TooltipDots
          curve={optimalCurve}
          color={OPTIMAL_COLOR}
          dotRadius={DOT_RADIUS}
          xScale={xScale}
          yScale={yScale}
          tooltipData={tooltipData}
          showTooltip={showTooltip}
          showTooltipAt={showTooltipAt}
          hideTooltip={hideTooltip}
        />
      </Graph>
      <Tooltip info={tooltip} />
    </div>
  );
};

export default BonusSpinEvChart;
