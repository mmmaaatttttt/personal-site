import type { ScaleLinear } from "d3-scale";
import { useState } from "react";
import { clamp } from "@/utils/mathHelpers";
import { marketData } from "../../data";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type ParsedPoint = {
  x: number;
  year: number;
  month: number;
  sp500: number;
  jobOpenings: number;
};

export const parsed: ParsedPoint[] = marketData.map((d) => {
  const [year, month] = d.date.split("-").map(Number);
  return {
    x: year + (month - 1) / 12,
    year,
    month,
    sp500: d.sp500,
    jobOpenings: d.jobOpenings,
  };
});

const chatgptIdx = parsed.findIndex((d) => d.year === 2022 && d.month === 11);
export const INITIAL_IDX = chatgptIdx >= 0 ? chatgptIdx : parsed.length - 1;

export function formatDate(p: ParsedPoint): string {
  return `${MONTHS[p.month - 1]} ${p.year}`;
}

export function useMarketScrubber(
  xScale: ScaleLinear<number, number>,
  xMin: number,
  xMax: number,
) {
  const [currentIdx, setCurrentIdx] = useState(INITIAL_IDX);

  function handleDrag(_id: number, { x }: { x: number; y: number }) {
    const clamped = clamp(x, xMin, xMax);
    const dataX = xScale.invert(clamped);
    let nearestIdx = 0;
    let nearestDist = Infinity;
    parsed.forEach((p, i) => {
      const dist = Math.abs(p.x - dataX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    });
    setCurrentIdx(nearestIdx);
  }

  return { current: parsed[currentIdx], handleDrag };
}
