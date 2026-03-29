"use client";

import React, { useState } from "react";
import USMap from "@/components/story/shared/USMap";
import Select from "@/components/story/shared/Select";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Tooltip, { useTooltip } from "@/components/story/shared/Tooltip";

interface SelectableUSMapProps {
  data: any[];
  selectOptions: any[];
  getTooltipTitle: (properties: any) => string;
  getTooltipBody: (properties: any) => string | string[];
}

const SelectableUSMap: React.FC<SelectableUSMapProps> = ({
  data,
  selectOptions,
  getTooltipTitle,
  getTooltipBody,
}) => {
  const [selectedOption, setSelectedOption] = useState(selectOptions[0]);
  const { tooltip, showTooltip, hideTooltip } = useTooltip();

  const { value, label, accessor, colors } = selectedOption;

  return (
    <div className="relative w-full">
      <NarrowContainer width="100%" className="mb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">COLOR BY</span>
          <Select
            name="map-data"
            value={value}
            placeholder={label}
            onChange={setSelectedOption}
            options={selectOptions}
            className="flex-1 max-w-sm"
          />
        </div>
      </NarrowContainer>
      <USMap
        data={data}
        fillAccessor={accessor}
        colors={colors}
        getTooltipTitle={getTooltipTitle}
        getTooltipBody={getTooltipBody}
        onMouseMove={showTooltip}
        onMouseLeave={hideTooltip}
      />
      <Tooltip info={tooltip} />
    </div>
  );
};

export default SelectableUSMap;
