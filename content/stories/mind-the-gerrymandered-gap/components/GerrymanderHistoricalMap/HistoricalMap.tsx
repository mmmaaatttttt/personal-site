"use client";

import { scaleLinear } from "d3-scale";
import type { FC } from "react";
import BarGraph from "@/components/story/shared/BarGraph";
import ColumnLayout from "@/components/story/shared/ColumnLayout";
import SliderProvider from "@/components/story/shared/Slider/SliderProvider";
import USMap from "@/components/story/shared/USMap";
import COLORS from "@/utils/styles";
import type { ElectionRow, StateSummary } from "../../data";
import { buildBarData, computeFillValue, formatTooltip } from "./helpers";

const EG_MAX = 0.5;
const BAR_WIDTH = 1600;
const BAR_HEIGHT = 900;
const BAR_PADDING = 20;

const Y_SCALE = scaleLinear()
  .domain([0, 6])
  .range([BAR_HEIGHT - BAR_PADDING, BAR_PADDING]);

const MAP_COLORS = [COLORS.DARK_BLUE, COLORS.WHITE, COLORS.RED];
const MAP_DOMAIN = [-EG_MAX, 0, EG_MAX];

const SLIDER_DATA = [
  {
    title: (val: number) => `Year: ${val}`,
    min: 1996,
    max: 2016,
    initialValue: 2016,
    step: 2,
    color: COLORS.DARK_GRAY,
  },
  {
    title: (val: number) => `Minimum Number of Electors: ${val}`,
    min: 2,
    max: 10,
    initialValue: 2,
    step: 1,
    color: COLORS.DARK_GRAY,
  },
];

interface HistoricalMapProps {
  electionData: ElectionRow[];
  stateSummaries: StateSummary[];
}

const HistoricalMap: FC<HistoricalMapProps> = ({
  electionData,
  stateSummaries,
}) => {
  return (
    <SliderProvider
      initialData={SLIDER_DATA}
      width="100%"
      render={(sliderVals) => {
        const [currentYear, currentMinElectors] = sliderVals;
        const barData = buildBarData(
          currentYear,
          currentMinElectors,
          electionData,
          stateSummaries,
        );
        const labelFontSize = `${(currentMinElectors - 1) / 10 + 1.2}rem`;

        return (
          <ColumnLayout break="md">
            <USMap
              colors={MAP_COLORS}
              data={electionData}
              domain={MAP_DOMAIN}
              fillAccessor={(properties) => {
                const yearRows = (properties.values as ElectionRow[]).filter(
                  (r) => r.year === currentYear,
                );
                const summary = stateSummaries.find(
                  (s) => s.state === properties.name,
                );
                return computeFillValue(
                  yearRows.length,
                  currentMinElectors,
                  summary?.efficiencyGaps[currentYear],
                );
              }}
              getTooltipTitle={(properties) => properties.name}
              getTooltipBody={(properties) => {
                const yearRows = (properties.values as ElectionRow[]).filter(
                  (r) => r.year === currentYear,
                );
                const summary = stateSummaries.find(
                  (s) => s.state === properties.name,
                );
                return formatTooltip(
                  yearRows.length,
                  currentMinElectors,
                  summary?.efficiencyGaps[currentYear],
                  summary?.seatGaps[currentYear],
                );
              }}
            />
            <BarGraph
              animated={false}
              barData={barData}
              barLabel={(bar) => bar.key}
              color={COLORS.DARK_BLUE}
              height={BAR_HEIGHT}
              labelFontSize={labelFontSize}
              padding={BAR_PADDING}
              svgId="eg-chart"
              tickStep={2}
              width={BAR_WIDTH}
              yScale={Y_SCALE}
            />
          </ColumnLayout>
        );
      }}
    />
  );
};

export default HistoricalMap;
