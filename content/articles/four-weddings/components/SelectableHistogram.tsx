"use client";

import React, { useState, useMemo } from "react";
import { bin, max, range, extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import COLORS from "@/utils/styles";
import BarGraph from "@/components/story/shared/BarGraph";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Select from "@/components/story/shared/Select";

interface SelectableHistogramProps {
  data: any[];
  selectOptions: any[];
}

const SelectableHistogram: React.FC<SelectableHistogramProps> = ({
  data,
  selectOptions,
}) => {
  const [selectedOption, setSelectedOption] = useState(selectOptions[0]);

  const { value, label, accessor, step, format } = selectedOption;

  const validData = useMemo(() => data.filter((d) => accessor(d) !== null), [data, accessor]);

  const { barData, thresholds, yScale } = useMemo(() => {
    const vals = (extent(validData, accessor) as unknown as [number, number]) || [0, 100];
    const t = range(Math.min(vals[0], 0), vals[1] + 2 * step, step);
    
    // d3 v7 uses bin() instead of histogram()
    const binner = bin<any, number>()
      .value(accessor)
      .thresholds(t);
    
    const bins = binner(validData);

    // Filter out bins that have no data if they are outside the range, 
    // but keep them for consistent width if they are inside.
    // Legacy fix for bar widths:
    const lastIdx = bins.length - 1;
    if (bins.length > 1) {
      const bWidth = bins[1].x1! - bins[1].x0!;
      if (bins[0].x0 === undefined) bins[0].x0 = bins[0].x1! - bWidth;
      if (bins[lastIdx].x1 === undefined) bins[lastIdx].x1 = bins[lastIdx].x0! + bWidth;
    }

    const height = 600;
    const padding = { top: 10, bottom: 60, left: 10, right: 10 };
    
    const bd = bins.map((d: any, i: number) => ({
      key: i,
      height: d.length,
      x0: d.x0,
      x1: d.x1,
    }));

    const ys = scaleLinear()
      .domain([0, (max(bins, (d) => d.length) || 0) * 1.1])
      .range([height - padding.bottom, padding.top]);

    return { barData: bd, thresholds: t, yScale: ys, padding };
  }, [validData, accessor, step]);

  const width = 600;
  const height = 600;
  const padding = { top: 10, bottom: 60, left: 10, right: 10 };

  return (
    <NarrowContainer width="100%" className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">VARIABLE</span>
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
        height={height}
        histogram
        padding={padding}
        svgId="histogram"
        thresholds={thresholds}
        tickFormat={format}
        tickStep={10}
        width={width}
        yScale={yScale}
      />
    </NarrowContainer>
  );
};

export default SelectableHistogram;
