"use client";

import MultiBarGraph from "@/components/story/shared/MultiBarGraph";
import { generateTooltipData } from "../../data/beautiful-analysis";
import baSummary from "../../data/ba-summary.json";
import baProfanity from "../../data/ba-profanity.json";
import COLORS from "@/utils/styles";

interface BaMultiBarGraphProps {
  dataType?: "summary" | "profanity";
  containerWidth?: string | number;
  height?: number;
  id?: string;
  legendTitle?: string;
  padding?: number | { top: number; bottom: number; left: number; right: number };
  yAxisLabel?: string;
  yMax?: number;
}

const BaMultiBarGraph = ({ dataType = "summary", ...props }: BaMultiBarGraphProps) => {
  const data = (dataType === "summary" ? baSummary : baProfanity) as any[];
  return (
    <MultiBarGraph
      {...props}
      data={data}
      getTooltipData={generateTooltipData}
      colors={[COLORS.DARK_BLUE, COLORS.ORANGE]}
    />
  );
};

export default BaMultiBarGraph;
