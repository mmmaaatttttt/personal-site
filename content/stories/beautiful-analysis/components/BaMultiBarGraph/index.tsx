"use client";

import React from "react";
import MultiBarGraph from "@/components/story/shared/MultiBarGraph";
import { generateTooltipData } from "../../data/beautiful-analysis";

import baSummary from "../../data/ba-summary.json";
import baProfanity from "../../data/ba-profanity.json";
import COLORS from "@/utils/styles";

interface BaDataPoint {
  meta: {
    id: number;
    title: string;
    date: string;
  };
  counts: {
    Chris: number;
    Caller: number;
  };
}

interface BaMultiBarGraphProps {
  colors?: string[];
  dataType?: "summary" | "profanity";
  legendTitle?: string;
  padding?: { top?: number; left?: number; right?: number; bottom?: number } | number;
  yAxisLabel?: string;
  id?: string;
  containerWidth?: string | number;
  height?: number;
  yMax?: number;
}

const BaMultiBarGraph: React.FC<BaMultiBarGraphProps> = ({ 
  dataType = "summary", 
  colors = [COLORS.DARK_BLUE, COLORS.ORANGE], 
  ...props 
}) => {
  const data = (dataType === "summary" ? baSummary : baProfanity) as BaDataPoint[];
  return (
    <div className="w-full my-12" data-testid="ba-multi-bar-graph-container">
      <MultiBarGraph
        {...props}
        colors={colors}
        data={data}
        getTooltipData={generateTooltipData}
      />
    </div>
  );
};

export default BaMultiBarGraph;
