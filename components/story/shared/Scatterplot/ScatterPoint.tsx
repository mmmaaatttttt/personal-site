"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import { darkenHex } from "@/utils/colorHelpers";

interface ScatterPointProps {
  cx: number;
  cy: number;
  area: number;
  fill: string;
  index: number;
}

const ScatterPoint = memo<ScatterPointProps>(
  ({ cx, cy, area, fill, index }) => {
    const stroke = darkenHex(fill, 0.3);
    return (
      <motion.circle
        initial={false}
        animate={{
          r: Math.sqrt(area),
          cx,
          cy,
          fill,
        }}
        transition={{
          duration: 0.5,
          delay: index * 0.002,
        }}
        stroke={stroke}
        strokeWidth={1}
      />
    );
  },
);

export default ScatterPoint;
