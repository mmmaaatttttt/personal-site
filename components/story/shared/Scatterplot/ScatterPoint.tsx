"use client";

import { motion } from "framer-motion";
import { memo } from "react";

interface ScatterPointProps {
  cx: number;
  cy: number;
  area: number;
  fill: string;
  index: number;
}

const ScatterPoint = memo<ScatterPointProps>(
  ({ cx, cy, area, fill, index }) => {
    return (
      <motion.circle
        initial={{ r: 0, cx: cx, cy: cy }}
        animate={{
          r: Math.sqrt(area),
          cx: cx,
          cy: cy,
          fill: fill,
        }}
        transition={{
          duration: 0.5,
          delay: index * 0.002,
        }}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth={1}
        whileHover={{ strokeWidth: 2, stroke: "rgba(0,0,0,0.5)" }}
      />
    );
  },
);

export default ScatterPoint;
