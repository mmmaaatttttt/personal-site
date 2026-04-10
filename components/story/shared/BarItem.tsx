"use client";

import React from "react";
import { motion } from "framer-motion";

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
}) => {
  return (
    <g>
      <motion.rect
        initial={{ height: 0, y: graphHeight - paddingBottom }}
        animate={{ x, width, y, height, fill: data.color || color }}
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
