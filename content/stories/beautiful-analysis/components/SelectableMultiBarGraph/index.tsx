"use client";

import { type FC, useMemo, useState } from "react";
import MultiBarGraph from "@/components/story/shared/MultiBarGraph";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Select from "@/components/story/shared/Select";
import COLORS from "@/utils/styles";
import baSentimentCounts, {
  type EpisodeSentimentCounts,
} from "../../data/ba-sentiment-counts";
import {
  defaultSentimentOptions,
  generateTooltipData,
} from "../../data/beautiful-analysis";

interface SelectableMultiBarGraphProps {
  colors?: string[];
  containerWidth?: string | number;
  height?: number;
  id?: string;
  legendTitle?: string;
  padding?:
    | number
    | { top: number; bottom: number; left: number; right: number };
  yAxisLabel?: string;
  yMax?: number;
}

const SelectableMultiBarGraph: FC<SelectableMultiBarGraphProps> = ({
  colors = [COLORS.DARK_BLUE, COLORS.ORANGE],
  containerWidth = "100%",
  height = 400,
  id = "selectable-multi-bar-graph",
  legendTitle = "Legend",
  padding = 0,
  yAxisLabel = "Y Axis",
  yMax = 400,
}) => {
  const options = defaultSentimentOptions;
  const [selectedOption, setSelectedOption] = useState(
    options[0][Math.floor(options[0].length / 2)],
  );

  if (!options || options.length === 0) return null;
  const { value, label } = selectedOption;

  const dataForOption = useMemo(() => {
    if (!Array.isArray(baSentimentCounts) || baSentimentCounts.length === 0)
      return [];
    return baSentimentCounts.map((d: EpisodeSentimentCounts) => {
      const c = d.counts[parseInt(value || "0", 10)];
      return {
        meta: d.meta,
        counts: {
          Chris: c.Chris,
          Caller: c.Caller,
        },
      };
    });
  }, [value]);

  const dynamicYMax = useMemo(() => {
    if (!dataForOption.length) return yMax;
    const maxVal = Math.max(
      ...dataForOption.map((d) =>
        Object.values(d.counts).reduce((a, b) => a + b, 0),
      ),
    );
    return Math.ceil((maxVal * 1.1) / 100) * 100; // 10% buffer, rounded to nearest 100
  }, [dataForOption, yMax]);

  return (
    <div
      className="my-12 w-full"
      data-testid="selectable-multi-bar-graph-container"
    >
      <NarrowContainer width="100%" className="mb-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold tracking-wider text-gray-500 uppercase">
            Sentiment Range
          </span>
          <Select
            name="sentiment-range"
            value={value}
            placeholder={label}
            onChange={setSelectedOption}
            options={options[0]}
            className="max-w-md flex-1"
          />
        </div>
      </NarrowContainer>

      <MultiBarGraph
        colors={colors}
        containerWidth={containerWidth}
        data={dataForOption}
        getTooltipData={generateTooltipData}
        height={height}
        id={id}
        legendTitle={legendTitle}
        padding={padding}
        yAxisLabel={yAxisLabel}
        yMax={dynamicYMax}
      />
    </div>
  );
};

export default SelectableMultiBarGraph;
