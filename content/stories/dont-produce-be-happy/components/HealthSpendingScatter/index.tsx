"use client";

import { scaleLinear } from "d3-scale";
import { motion } from "framer-motion";
import Axis from "@/components/story/shared/Axis";
import AxisLabel from "@/components/story/shared/AxisLabel";
import Graph from "@/components/story/shared/Graph";
import Legend from "@/components/story/shared/Legend";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import Tooltip, { useTooltip } from "@/components/story/shared/Tooltip";
import { formatCurrency } from "@/utils/formatHelpers";
import COLORS from "@/utils/styles";
import type { HealthOutcomeByYear } from "../../healthSpendingData";
import useHealthSpendingScatter from "./useHealthSpendingScatter";

const WIDTH = 800;
const HEIGHT = 450;
const GRAPH_PADDING = { top: 20, bottom: 50, left: 70, right: 20 };
const AXIS_FONT = "12px";
const TRANSITION_DURATION = 0.4;
const X_DOMAIN: [number, number] = [0, 14000];
const Y_DOMAIN: [number, number] = [45, 87];

const xScale = scaleLinear()
  .domain(X_DOMAIN)
  .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);
const yScale = scaleLinear()
  .domain(Y_DOMAIN)
  .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

const LEGEND_LABELS = [
  { text: "North America", color: COLORS.ORANGE },
  { text: "South America", color: COLORS.MAROON },
  { text: "Africa", color: COLORS.PURPLE },
  { text: "Europe", color: COLORS.DARK_BLUE },
  { text: "Asia", color: COLORS.GREEN },
  { text: "Oceania", color: COLORS.BLUE },
];

interface HealthSpendingScatterProps {
  healthOutcomesByYear: HealthOutcomeByYear[];
}

export default function HealthSpendingScatter({
  healthOutcomesByYear,
}: HealthSpendingScatterProps) {
  const { sliderData, data } = useHealthSpendingScatter(healthOutcomesByYear);
  const { tooltip, showTooltip, showTooltipAt, hideTooltip } = useTooltip();

  return (
    <NarrowContainer width="85%" fullWidthAt="lg">
      <div className="w-full">
        <SliderGroup data={sliderData} />
      </div>
      <Legend labels={LEGEND_LABELS} />
      <Graph
        axes={false}
        graphPadding={GRAPH_PADDING}
        width={WIDTH}
        height={HEIGHT}
        xScale={xScale}
        yScale={yScale}
        gridlinesHorizontal
        gridlinesVertical
      >
        <Axis
          key="y-axis"
          direction="y"
          scale={yScale}
          tickFormat="d"
          fontSize={AXIS_FONT}
        />
        <Axis
          key="x-axis"
          direction="x"
          scale={xScale}
          tickFormat="$,"
          rotateLabels={false}
          textAnchor="middle"
          labelPosition={{ dy: "0.71em" }}
          fontSize={AXIS_FONT}
        />
        <AxisLabel
          x={10}
          y={HEIGHT / 2}
          dy={10}
          transform={`rotate(-90 10,${HEIGHT / 2})`}
        >
          Life Expectancy (years)
        </AxisLabel>
        <AxisLabel x={WIDTH / 2} y={HEIGHT - 8} anchor="middle">
          Healthcare Spending Per Capita (USD)
        </AxisLabel>
        {data.map((point) => {
          const lifeExpectancyText = `${point.cy.toFixed(1)} years`;
          const healthSpendingText = `${formatCurrency(point.cx)} per capita`;
          const tooltipBody = [healthSpendingText, lifeExpectancyText];

          return (
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
              aria-label={`${point.label}, life expectancy ${lifeExpectancyText}, health spending ${healthSpendingText}`}
              onMouseEnter={showTooltip(point.label, tooltipBody)}
              onMouseLeave={hideTooltip}
              onFocus={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                showTooltipAt(
                  point.label,
                  tooltipBody,
                  rect.left + rect.width / 2,
                  rect.top,
                );
              }}
              onBlur={hideTooltip}
            />
          );
        })}
      </Graph>
      <Tooltip info={tooltip} />
    </NarrowContainer>
  );
}
