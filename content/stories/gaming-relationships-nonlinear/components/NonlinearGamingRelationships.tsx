"use client";

import GamingRelationships from "@/components/story/shared/GamingRelationships";
import { nonlinearVisData } from "../data";

// Both nonlinear visualizations use step=0.02; the three-person chart extends max to 40.
const STEP = 0.02;
const maxByIdx = [20, 40];

interface Props {
  idx: number | string;
}

export default function NonlinearGamingRelationships({ idx }: Props) {
  const i = typeof idx === "string" ? parseInt(idx, 10) : idx;
  return (
    <GamingRelationships
      visData={nonlinearVisData[i]}
      compact={i === 1}
      step={STEP}
      max={maxByIdx[i]}
    />
  );
}
