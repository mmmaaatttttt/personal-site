"use client";

import { type FC, useState } from "react";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Select from "@/components/story/shared/Select";
import Tooltip, { useTooltip } from "@/components/story/shared/Tooltip";
import USMap from "@/components/story/shared/USMap";
import { useIsMounted } from "@/hooks/useIsMounted";
import type { MapOption, MapProperties, WeddingData } from "../../types";

interface SelectableUSMapProps {
  data: WeddingData[];
  selectOptions: MapOption[];
  getTooltipTitle?: (properties: MapProperties) => string;
  getTooltipBody?: (properties: MapProperties) => string | string[];
}

const SelectableUSMap: FC<SelectableUSMapProps> = ({
  data,
  selectOptions,
  getTooltipTitle,
  getTooltipBody,
}) => {
  const isMounted = useIsMounted();
  const [selectedOption, setSelectedOption] = useState<MapOption>(
    selectOptions[0],
  );
  const { tooltip, showTooltip, hideTooltip } = useTooltip();

  const { value, label, accessor, colors } = selectedOption;

  if (!isMounted) {
    return (
      <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-nav/10" />
    );
  }

  const titleHelper = getTooltipTitle || ((p: MapProperties) => p.name || "");
  const bodyHelper =
    getTooltipBody ||
    ((p: MapProperties) =>
      p.values?.length ? `${p.values.length} items` : "");

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
