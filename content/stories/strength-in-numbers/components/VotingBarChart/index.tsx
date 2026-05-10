"use client";

import { scaleLinear } from "d3-scale";
import { useState } from "react";
import BarGraph from "@/components/story/shared/BarGraph";
import Caption from "@/components/story/shared/Caption";
import Select from "@/components/story/shared/Select";
import SliderProvider from "@/components/story/shared/Slider/SliderProvider";
import COLORS from "@/utils/styles";
import type { VotingDataRow } from "../../data";
import {
  MAX_YEAR,
  MIN_YEAR,
  PARTY_BAR_OPTIONS,
  VOTERS_BAR_OPTIONS,
  YEAR_STEP,
} from "./constants";

const SVG_WIDTH = 900;
const SVG_HEIGHT = 400;
const PADDING = { top: 20, right: 0, bottom: 6, left: 60 };

const partyColorScale = scaleLinear<string>()
  .domain([-50, 50])
  .range([COLORS.DARK_BLUE, COLORS.RED]);

interface VotingBarChartProps {
  data: VotingDataRow[];
  variant: "voters" | "party";
  caption?: string;
}

const sliderData = [
  {
    min: MIN_YEAR,
    max: MAX_YEAR,
    step: YEAR_STEP,
    initialValue: MIN_YEAR,
    color: COLORS.DARK_GRAY,
    tickCount: Math.round((MAX_YEAR - MIN_YEAR) / YEAR_STEP) + 1,
    title: (year: number) => `Year: ${year}`,
  },
];

const VotingBarChart = ({ data, variant, caption }: VotingBarChartProps) => {
  const options = variant === "voters" ? VOTERS_BAR_OPTIONS : PARTY_BAR_OPTIONS;
  const [selectedValue, setSelectedValue] = useState(options[0].value);

  const selectOptions = options.map((o) => ({
    value: o.value,
    label: o.label,
  }));

  return (
    <Caption caption={caption}>
      <SliderProvider
        initialData={sliderData}
        width="100%"
        fullWidthAt="md"
        render={([curYear]) => {
          const option =
            options.find((o) => o.value === selectedValue) ?? options[0];
          const allHeights = data
            .map((d) => option.accessor(d))
            .filter(
              (h): h is number => h !== null && Number.isFinite(h) && h > 0,
            );
          const maxHeight = Math.max(...allHeights, 0);

          const yScale = scaleLinear()
            .domain([0, 1.1 * maxHeight])
            .range([SVG_HEIGHT - PADDING.bottom, PADDING.top]);

          const barData = data
            .filter((d) => d.year === curYear)
            .map((d) => {
              const height = option.accessor(d);
              return {
                key: d.abbreviation,
                height: height !== null && Number.isFinite(height) ? height : 0,
                color:
                  variant === "party"
                    ? partyColorScale(d.rep_percent - d.dem_percent)
                    : option.color,
              };
            })
            .filter((d) => d.height > 0)
            .sort((a, b) => a.height - b.height);

          const hasData = barData.length > 0;

          return (
            <div className="mt-4 space-y-3">
              <Select
                name="statistic"
                value={selectedValue}
                onChange={(opt) => setSelectedValue(opt.value)}
                options={selectOptions}
              />
              {hasData ? (
                <div className="w-[130%] -ml-[15%] max-md:w-full max-md:ml-0">
                  <BarGraph
                    animated={false}
                    barData={barData}
                    barLabel={(d) => d.key}
                    color={option.color}
                    height={SVG_HEIGHT}
                    padding={PADDING}
                    svgId={`bar-graph-${variant}`}
                    width={SVG_WIDTH}
                    yScale={yScale}
                    yTickFormat={option.format}
                    gridlinesVertical={false}
                  />
                </div>
              ) : (
                <>
                  <h4 className="text-lg font-bold">
                    {option.label} has no data for {curYear}.
                  </h4>
                  <p>Please make another selection.</p>
                </>
              )}
            </div>
          );
        }}
      />
    </Caption>
  );
};

export default VotingBarChart;
