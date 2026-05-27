"use client";

import type { FC } from "react";
import { useChart } from "@/context/ChartContext";

interface VerticalMarkerProps {
  x: number;
  label?: string;
  color: string;
}

const VerticalMarker: FC<VerticalMarkerProps> = ({ x, label, color }) => {
  const chart = useChart();
  if (!chart) return null;
  const { xScale, height, padding } = chart;
  const xPx = xScale(x) ?? 0;
  return (
    <g>
      <line
        x1={xPx}
        x2={xPx}
        y1={padding.top}
        y2={height - padding.bottom}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="6 4"
      />
      {label && (
        <text
          x={xPx + 4}
          y={padding.top + 14}
          fill={color}
          fontSize="11"
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  );
};

export default VerticalMarker;
