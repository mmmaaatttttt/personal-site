"use client";

import React, { useState, useMemo } from "react";
import MultiBarGraph from "@/components/story/shared/MultiBarGraph";
import Select from "@/components/story/shared/Select";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { generateTooltipData, defaultSentimentOptions } from "../../data/beautiful-analysis";
import baSentimentCounts from "../../data/ba-sentiment-counts.json";
import COLORS from "@/utils/styles";

interface SentimentCount {
  Chris: number;
  Caller: number;
}

interface SentimentData {
  meta: string;
  counts: SentimentCount[];
}

interface SelectableMultiBarGraphProps {
  colors?: string[];
  containerWidth?: string | number;
  height?: number;
  id?: string;
  legendTitle?: string;
  padding?: { top?: number; left?: number; right?: number; bottom?: number } | number;
  yAxisLabel?: string;
  yMax?: number;
}

const SelectableMultiBarGraph: React.FC<SelectableMultiBarGraphProps> = ({
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
  const [selectedOption, setSelectedOption] = useState(options[0][Math.floor(options[0].length / 2)]);
  
  if (!options || options.length === 0) return null;
  const { value, label } = selectedOption;
  const dataForOption = useMemo(() => {
    if (!Array.isArray(baSentimentCounts) || baSentimentCounts.length === 0) return [];
    return (baSentimentCounts as SentimentData[]).map((d) => {
      const c = d.counts[parseInt(value || "0", 10)];
      return {
        meta: d.meta,
        counts: {
          Chris: c.Chris,
          Caller: c.Caller
        }
      };
    });
  }, [value]);

  return (
    <div className="w-full my-12" data-testid="selectable-multi-bar-graph-container">
      <NarrowContainer width="100%" className="mb-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Sentiment Range</span>
          <Select
            name="sentiment-range"
            value={value}
            placeholder={label}
            onChange={setSelectedOption}
            options={options[0]}
            className="flex-1 max-w-md"
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
        yMax={yMax}
      />
    </div>
  );
};

export default SelectableMultiBarGraph;
