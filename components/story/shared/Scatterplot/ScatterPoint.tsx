"use client";

import { motion } from "framer-motion";
import { memo } from "react";

function darkenHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace(/^#/, ""), 16);
  const r = Math.floor(((num >> 16) & 0xff) * (1 - amount));
  const g = Math.floor(((num >> 8) & 0xff) * (1 - amount));
  const b = Math.floor((num & 0xff) * (1 - amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

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
