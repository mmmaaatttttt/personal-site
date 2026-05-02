"use client";

import { motion } from "framer-motion";
import React from "react";

interface BarData {
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
  graphHeight: number;
  paddingBottom: number;
  barLabel?: (d: BarData) => string | number;
  fontSize: string;
  /** When false: bars appear instantly at their position and track updates in 100ms (no entrance animation). Default true uses staggered entrance from the bottom. */
  animated?: boolean;
}

const BarItem: React.FC<BarItemProps> = ({
  data,
  index,
  x,
  y,
  width,
  height,
  color,
  graphHeight,
  paddingBottom,
  barLabel,
  fontSize,
  animated = true,
}) => {
  if (!animated) {
    // No entrance animation; bars appear at their correct position and
    // animate to new positions quickly as values change (matching legacy 100ms behavior).
    return (
      <g>
        <motion.rect
          initial={false}
          animate={{ x, width, y, height }}
          fill={data.color || color}
          transition={{ duration: 0.1 }}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={1}
        />
        {barLabel && (
          <motion.text
            initial={false}
            animate={{ x: x + width / 2, y }}
            transition={{ duration: 0.1 }}
            dy={-12}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fontSize}
            className="fill-current font-medium pointer-events-none"
          >
            {barLabel(data)}
          </motion.text>
        )}
      </g>
    );
  }

  return (
    <g>
      <motion.rect
        initial={{ height: 0, y: graphHeight - paddingBottom }}
        animate={{ x, width, y, height }}
        fill={data.color || color}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth={1}
      />
      {barLabel && (
        <motion.text
          x={x + width / 2}
          y={y}
          dy={-12}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          className="fill-current font-medium pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.05 }}
        >
          {barLabel(data)}
        </motion.text>
      )}
    </g>
  );
};

export default BarItem;
