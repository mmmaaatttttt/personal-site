"use client";

import { motion } from "framer-motion";
import { memo } from "react";

export interface BarData {
  key: string | number;
  height: number;
  color?: string;
  x0?: number;
  x1?: number;
}

interface BarItemProps {
  data: BarData;
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  barLabel?: (d: BarData) => string | number;
  fontSize: string;
  labelDy?: number;
  /** When false: bars appear instantly at their position and track updates in 100ms (no entrance animation). Default true uses staggered 500ms transitions matching legacy react-move behavior. */
  animated?: boolean;
}

const BarItem = memo<BarItemProps>(
  ({
    data,
    index,
    x,
    y,
    width,
    height,
    color,
    barLabel,
    fontSize,
    labelDy = -12,
    animated = true,
  }) => {
    const transition = animated
      ? { duration: 0.5, delay: index * 0.025 }
      : { duration: 0.1 };

    return (
      <g>
        <motion.rect
          initial={false}
          animate={{ x, width, y, height }}
          fill={data.color || color}
          transition={transition}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={1}
        />
        {barLabel && (
          <motion.text
            initial={false}
            animate={{ x: x + width / 2, y }}
            dy={labelDy}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fontSize}
            className="fill-current font-medium pointer-events-none"
            transition={transition}
          >
            {barLabel(data)}
          </motion.text>
        )}
      </g>
    );
  },
);

export default BarItem;
