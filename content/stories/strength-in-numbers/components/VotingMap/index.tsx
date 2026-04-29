"use client";

import { useState } from "react";
import { format } from "d3-format";
import Caption from "@/components/story/shared/Caption";
import USMap from "@/components/story/shared/USMap";
import Tooltip, { useTooltip } from "@/components/story/shared/Tooltip";
import SliderProvider from "@/components/story/shared/Slider/SliderProvider";
import Select from "@/components/story/shared/Select";
import COLORS from "@/utils/styles";
import type { VotingDataRow } from "../../data";
import {
  VOTERS_MAP_OPTIONS,
  WORKERS_MAP_OPTIONS,
  MIN_YEAR,
  MAX_YEAR,
  YEAR_STEP,
} from "./constants";

interface VotingMapProps {
  data: VotingDataRow[];
  variant: "voters" | "workers";
  caption?: string;
}

const sliderData = [
  {
    min: MIN_YEAR,
    max: MAX_YEAR,
    step: YEAR_STEP,
    initialValue: MAX_YEAR,
    color: COLORS.DARK_GRAY,
    tickCount: Math.round((MAX_YEAR - MIN_YEAR) / YEAR_STEP) + 1,
    title: (year: number) => `Year: ${year}`,
  },
];

const VotingMap = ({ data, variant, caption }: VotingMapProps) => {
  const options =
    variant === "voters" ? VOTERS_MAP_OPTIONS : WORKERS_MAP_OPTIONS;
  const [selectedValue, setSelectedValue] = useState(options[0].value);
  const { tooltip, showTooltip, hideTooltip } = useTooltip();

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
          const fmt = format(option.format);

          const validValues = data
            .map((d) => option.accessor(d))
            .filter((v): v is number => v !== null && isFinite(v));
          const domain: [number, number] | undefined =
            validValues.length > 0
              ? [Math.min(...validValues), Math.max(...validValues)]
              : undefined;

          return (
            <div className="mt-4 space-y-3">
              <Select
                name="statistic"
                value={selectedValue}
                onChange={(opt) => setSelectedValue(opt.value)}
                options={selectOptions}
              />
              <USMap
                colors={option.colors}
                data={data}
                domain={domain}
                fillAccessor={(properties) => {
                  const yearRow = (properties.values as VotingDataRow[]).find(
                    (r) => r.year === curYear,
                  );
                  if (!yearRow) return null;
                  return option.accessor(yearRow);
                }}
                getTooltipTitle={(properties) => properties.name}
                getTooltipBody={(properties) => {
                  const yearRow = (properties.values as VotingDataRow[]).find(
                    (r) => r.year === curYear,
                  );
                  if (!yearRow) return "No data available";
                  const val = option.accessor(yearRow);
                  if (val === null || !isFinite(val))
                    return "No data available";
                  return `${option.label}: ${fmt(val)}`;
                }}
                id={`voting-map-${variant}`}
                onMouseMove={showTooltip}
                onMouseLeave={hideTooltip}
              />
            </div>
          );
        }}
      />
      <Tooltip info={tooltip} />
    </Caption>
  );
};

export default VotingMap;
