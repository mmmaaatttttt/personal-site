"use client";

import type { FC } from "react";
import { useChart } from "@/context/ChartContext";

const LABEL_X_OFFSET = 4;
const LABEL_Y_FROM_TOP = 14;
const LABEL_FONT_SIZE = 11;
const STROKE_WIDTH = 2;
const DASH_ARRAY = "6 4";

interface VerticalMarkerProps {
  x: number;
  label?: string;
  labelYOffset?: number;
  color: string;
}

const VerticalMarker: FC<VerticalMarkerProps> = ({
  x,
  label,
  labelYOffset = 0,
  color,
}) => {
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
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={DASH_ARRAY}
      />
      {label && (
        <text
          x={xPx + LABEL_X_OFFSET}
          y={padding.top + LABEL_Y_FROM_TOP + labelYOffset}
          fill={color}
          fontSize={LABEL_FONT_SIZE}
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  );
};

export default VerticalMarker;
