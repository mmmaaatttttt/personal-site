"use client";

import React from "react";
import HorizontalBarGraph from "@/components/story/shared/HorizontalBarGraph";
import baFeatures from "../data/ba-features.json";
import { colorMap } from "../data/beautiful-analysis";

const BaHorizontalBarGraph = () => {
  const data = baFeatures.map((d: any) => ({
    ...d,
    fill: (colorMap as any)[d.width > 0 ? "Chris" : "Caller"],
  }));

  return <HorizontalBarGraph data={data} />;
};

export default BaHorizontalBarGraph;
