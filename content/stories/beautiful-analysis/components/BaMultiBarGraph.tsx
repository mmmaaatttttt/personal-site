"use client";

import React from "react";
import MultiBarGraph from "@/components/story/shared/MultiBarGraph";
import { generateTooltipData } from "../data/beautiful-analysis";

import baSummary from "../data/ba-summary.json";
import baProfanity from "../data/ba-profanity.json";
import COLORS from "@/utils/styles";

interface BaMultiBarGraphProps {
  colors?: string[];
  dataType?: "summary" | "profanity";
  legendTitle?: string;
  padding?: any;
  yAxisLabel?: string;
}

const BaMultiBarGraph: React.FC<BaMultiBarGraphProps> = ({ dataType = "summary", colors = [COLORS.DARK_BLUE, COLORS.ORANGE], ...props }) => {
  const data = dataType === "summary" ? baSummary : baProfanity;
  return (
    <MultiBarGraph
      {...props}
      colors={colors}
      data={data}
      getTooltipData={generateTooltipData}
    />
  );
};

export default BaMultiBarGraph;
