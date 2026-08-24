"use client";

import type { FC } from "react";
import { useChart } from "@/context/ChartContext";
import COLORS from "@/utils/styles";

const RADIUS = 5;

interface TrueRateMarkerProps {
  trueResponseRate: number;
}

const TrueRateMarker: FC<TrueRateMarkerProps> = ({ trueResponseRate }) => {
  const chart = useChart();
  if (!chart) return null;
  const { xScale, yScale } = chart;
  const cx = xScale(trueResponseRate) ?? 0;
  const cy = yScale(trueResponseRate) ?? 0;
  return <circle cx={cx} cy={cy} r={RADIUS} fill={COLORS.DARK_GRAY} />;
};

export default TrueRateMarker;
