"use client";

import type React from "react";
import { useEffect, useState } from "react";
import FlexContainer from "@/components/story/shared/FlexContainer";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Scatterplot from "@/components/story/shared/Scatterplot";
import Select from "@/components/story/shared/Select";
import type { ScatterOption, WeddingData } from "../../types";

interface SelectableScatterplotProps {
  data: WeddingData[];
  selectOptions: ScatterOption[];
  graphOptions: {
    colorScale: (ranking: number | null) => string;
  };
}

const DEFAULT_HEIGHT = 400;
const DEFAULT_WIDTH = 500;
const DEFAULT_PADDING = 55;
const DEFAULT_DOT_AREA = 100;

const SelectableScatterplot: React.FC<SelectableScatterplotProps> = ({
  data,
  selectOptions,
  graphOptions,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedOptionX, setSelectedOptionX] = useState<ScatterOption>(
    selectOptions[0],
  );
  const [selectedOptionY, setSelectedOptionY] = useState<ScatterOption>(
    selectOptions[1],
  );
  const [selectedOptionR] = useState<ScatterOption | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    accessor: accessorX,
    value: valueX,
    format: formatX,
  } = selectedOptionX;
  const {
    accessor: accessorY,
    value: valueY,
    format: formatY,
  } = selectedOptionY;
  const accessorR =
    (selectedOptionR as ScatterOption)?.accessor || (() => DEFAULT_DOT_AREA);
  const { colorScale } = graphOptions;

  if (!isMounted) {
    return <div className="h-[400px] w-full animate-pulse bg-nav/10" />;
  }

  const scatterData = data
    .filter(
      (d) =>
        accessorX(d) !== null && accessorY(d) !== null && accessorR(d) !== null,
    )
    .map((d) => ({
      cx: accessorX(d) || 0,
      cy: accessorY(d) || 0,
      area: accessorR(d) || DEFAULT_DOT_AREA,
      fill: colorScale(d.ranking),
      key: `${d.season}:${d.episode} - ${d.name}`,
    }));

  return (
    <NarrowContainer width="100%" className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <FlexContainer cross="center" className="flex-1">
          <span className="text-sm font-semibold text-gray-500 mr-2 whitespace-nowrap uppercase tracking-wider">
            X-Axis
          </span>
          <Select
            name="scatter-data-x"
            value={valueX}
            onChange={setSelectedOptionX}
            options={selectOptions}
            className="flex-1"
          />
        </FlexContainer>
        <FlexContainer cross="center" className="flex-1">
          <span className="text-sm font-semibold text-gray-500 mr-2 whitespace-nowrap uppercase tracking-wider">
            Y-Axis
          </span>
          <Select
            name="scatter-data-y"
            value={valueY}
            onChange={setSelectedOptionY}
            options={selectOptions}
            className="flex-1"
          />
        </FlexContainer>
      </div>
      <Scatterplot
        data={scatterData}
        {...graphOptions}
        width={DEFAULT_WIDTH}
        height={DEFAULT_HEIGHT}
        graphPadding={DEFAULT_PADDING}
        tickFormatX={formatX}
        tickFormatY={formatY}
      />
    </NarrowContainer>
  );
};

export default SelectableScatterplot;
