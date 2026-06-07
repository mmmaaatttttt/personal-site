"use client";

import { format } from "d3-format";
import { useState } from "react";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Select from "@/components/story/shared/Select";
import { SliderGroup } from "@/components/story/shared/Slider";
import Tooltip, { useTooltip } from "@/components/story/shared/Tooltip";
import USMap from "@/components/story/shared/USMap";
import useSliders from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import type { VotingDataRow } from "../../data";
import {
  MAX_YEAR,
  MIN_YEAR,
  VOTERS_MAP_OPTIONS,
  WORKERS_MAP_OPTIONS,
  YEAR_STEP,
} from "./constants";

interface VotingMapProps {
  data: VotingDataRow[];
  variant: "voters" | "workers";
}

const SLIDER_CONFIG = [
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

const VotingMap = ({ data, variant }: VotingMapProps) => {
  const options =
    variant === "voters" ? VOTERS_MAP_OPTIONS : WORKERS_MAP_OPTIONS;
  const [selectedValue, setSelectedValue] = useState(options[0].value);
  const { tooltip, showTooltip, hideTooltip } = useTooltip();
  const { values, sliderData } = useSliders(SLIDER_CONFIG);
  const [curYear] = values;

  const selectOptions = options.map((o) => ({
    value: o.value,
    label: o.label,
  }));

  const option = options.find((o) => o.value === selectedValue) ?? options[0];
  const fmt = format(option.format);

  const validValues = data
    .map((d) => option.accessor(d))
    .filter((v): v is number => v !== null && Number.isFinite(v));
  const domain: [number, number] | undefined =
    validValues.length > 0
      ? [Math.min(...validValues), Math.max(...validValues)]
      : undefined;

  return (
    <>
      <NarrowContainer width="77%" fullWidthAt="md">
        <SliderGroup data={sliderData} />
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
              if (val === null || !Number.isFinite(val))
                return "No data available";
              return `${option.label}: ${fmt(val)}`;
            }}
            id={`voting-map-${variant}`}
            onMouseMove={showTooltip}
            onMouseLeave={hideTooltip}
          />
        </div>
      </NarrowContainer>
      <Tooltip info={tooltip} />
    </>
  );
};

export default VotingMap;
