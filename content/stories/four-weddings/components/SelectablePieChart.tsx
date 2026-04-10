"use client";

import React, { useState, useEffect } from "react";
import PieChart from "@/components/story/shared/PieChart";
import Select from "@/components/story/shared/Select";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { WeddingData, PieOption } from "../types";

interface SelectablePieChartProps {
  data: WeddingData[];
  selectOptions: PieOption[];
  graphOptions: {
    colorScale: (i: number) => string;
  };
}

const CHART_PADDING = 20;

const SelectablePieChart: React.FC<SelectablePieChartProps> = ({
  data,
  selectOptions,
  graphOptions,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PieOption>(selectOptions[0]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { value, label, accessor } = selectedOption;

  if (!isMounted) {
    return <div className="h-[400px] w-full animate-pulse bg-nav/10" />;
  }

  return (
    <NarrowContainer width="100%" className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">VARIABLE</span>
        <Select
          name="pie-data"
          value={value}
          placeholder={label}
          onChange={setSelectedOption}
          options={selectOptions}
          className="flex-1 max-w-sm"
        />
      </div>
      <PieChart values={accessor(data)} padding={CHART_PADDING} {...graphOptions} />
    </NarrowContainer>
  );
};

export default SelectablePieChart;
