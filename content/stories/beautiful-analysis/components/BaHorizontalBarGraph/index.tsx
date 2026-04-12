"use client";

import HorizontalBarGraph from "@/components/story/shared/HorizontalBarGraph";
import baFeatures from "../../data/ba-features.json";
import { colorMap } from "../../data/beautiful-analysis";

interface Feature {
  caption: string;
  width: number;
}

const BaHorizontalBarGraph = () => {
  const data = (baFeatures as Feature[]).map((d) => ({
    ...d,
    fill: colorMap[d.width > 0 ? "Chris" : "Caller"],
  }));

  return (
    <div className="w-full my-12" data-testid="ba-horizontal-bar-graph-container">
      <HorizontalBarGraph data={data} />
    </div>
  );
};

export default BaHorizontalBarGraph;
