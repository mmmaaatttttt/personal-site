"use client";

import React, { useState } from "react";
import PieChart from "@/components/story/shared/PieChart";
import Select from "@/components/story/shared/Select";
import NarrowContainer from "@/components/story/shared/NarrowContainer";

interface SelectablePieChartProps {
  data: any[];
  selectOptions: any[];
  graphOptions: any;
}

const SelectablePieChart: React.FC<SelectablePieChartProps> = ({
  data,
  selectOptions,
  graphOptions,
}) => {
  const [selectedOption, setSelectedOption] = useState(selectOptions[0]);

  const { value, label, accessor } = selectedOption;

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
      <PieChart values={accessor(data)} padding={20} {...graphOptions} />
    </NarrowContainer>
  );
};

export default SelectablePieChart;
