"use client";

import type React from "react";
import { useEffect, useState } from "react";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Select from "@/components/story/shared/Select";
import Tooltip, { useTooltip } from "@/components/story/shared/Tooltip";
import USMap from "@/components/story/shared/USMap";
import type { MapOption, WeddingData } from "../../types";

interface SelectableUSMapProps {
  data: WeddingData[];
  selectOptions: MapOption[];
  getTooltipTitle?: (properties: any) => string;
  getTooltipBody?: (properties: any) => string | string[];
}

const SelectableUSMap: React.FC<SelectableUSMapProps> = ({
  data,
  selectOptions,
  getTooltipTitle,
  getTooltipBody,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<MapOption>(
    selectOptions[0],
  );
  const { tooltip, showTooltip, hideTooltip } = useTooltip();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { value, label, accessor, colors } = selectedOption;

  if (!isMounted) {
    return (
      <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-nav/10" />
    );
  }

  const titleHelper = getTooltipTitle || ((p: any) => p.name || "");
  const bodyHelper =
    getTooltipBody ||
    ((p: any) => (p.values?.length ? `${p.values.length} items` : ""));

  return (
    <NarrowContainer width="100%" className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          VARIABLE
        </span>
        <Select
          name="map-data"
          value={value}
          placeholder={label}
          onChange={setSelectedOption}
          options={selectOptions}
          className="flex-1 max-w-sm"
        />
      </div>
      <div className="relative">
        <USMap
          data={data}
          fillAccessor={accessor}
          colors={colors}
          getTooltipTitle={titleHelper}
          getTooltipBody={bodyHelper}
          onMouseMove={showTooltip}
          onMouseLeave={hideTooltip}
        />
        <Tooltip info={tooltip} />
      </div>
    </NarrowContainer>
  );
};

export default SelectableUSMap;
