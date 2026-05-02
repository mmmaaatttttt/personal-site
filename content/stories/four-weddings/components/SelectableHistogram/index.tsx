"use client";

import { bin, extent, max, range } from "d3-array";
import { scaleLinear } from "d3-scale";
import { type FC, useEffect, useMemo, useState } from "react";
import BarGraph from "@/components/story/shared/BarGraph";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Select from "@/components/story/shared/Select";
import COLORS from "@/utils/styles";
import type { HistogramOption, WeddingData } from "../../types";

const DEFAULT_HEIGHT = 400;
const DEFAULT_WIDTH = 600;
const CHART_PADDING = { top: 10, bottom: 60, left: 60, right: 10 };
const DEFAULT_Y_TICK_STEP = 10;

interface SelectableHistogramProps {
  data: WeddingData[];
  selectOptions: HistogramOption[];
}

const SelectableHistogram: FC<SelectableHistogramProps> = ({
  data,
  selectOptions,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<HistogramOption>(
    selectOptions[0],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { value, label, accessor, step, format } = selectedOption;

  const validData = useMemo(() => {
    if (!isMounted) return [];
    return data.filter((d) => accessor(d) !== null);
  }, [data, accessor, isMounted]);

  const results = useMemo(() => {
    const vals = (extent(validData, accessor) as unknown as [
      number,
      number,
    ]) || [0, 100];
    const thresholds = range(Math.min(vals[0], 0), vals[1] + 2 * step, step);

    const binner = bin<WeddingData, number>()
      .value((d) => accessor(d) || 0)
      .thresholds(thresholds)
      .domain([thresholds[0], thresholds[thresholds.length - 1]]);

    const bins = binner(validData).filter(
      (b) => b.x0 !== undefined && b.x1 !== undefined && b.x0 < b.x1,
    );

    const yScale = scaleLinear()
      .domain([0, (max(bins, (d) => d.length) || 0) * 1.1])
      .range([DEFAULT_HEIGHT - CHART_PADDING.bottom, CHART_PADDING.top]);

    const barData = bins.map((d, i) => ({
      key: i,
      height: d.length,
      x0: d.x0,
      x1: d.x1,
    }));

    return { barData, thresholds, yScale };
  }, [validData, accessor, step]);

  const { barData, thresholds, yScale } = results;

  if (!isMounted) {
    return <div className="h-[400px] w-full animate-pulse bg-nav/10" />;
  }

  return (
    <NarrowContainer width="100%" className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          VARIABLE
        </span>
        <Select
          name="bar-data"
          value={value}
          placeholder={label}
          onChange={setSelectedOption}
          options={selectOptions}
          className="flex-1 max-w-sm"
        />
      </div>
      <BarGraph
        barData={barData}
        barLabel={(bar) => bar.height}
        color={COLORS.BLUE}
        height={DEFAULT_HEIGHT}
        histogram
        padding={CHART_PADDING}
        svgId="histogram"
        thresholds={thresholds}
        tickFormat={format}
        tickStepX={step}
        tickStepY={DEFAULT_Y_TICK_STEP}
        width={DEFAULT_WIDTH}
        yScale={yScale}
      />
    </NarrowContainer>
  );
};

export default SelectableHistogram;
