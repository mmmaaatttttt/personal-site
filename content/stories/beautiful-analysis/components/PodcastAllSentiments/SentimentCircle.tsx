"use client";

import React from "react";
import { motion } from "framer-motion";

interface SentimentCircleProps {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  delay: number;
}

const SentimentCircle: React.FC<SentimentCircleProps> = ({
  cx,
  cy,
  r,
  fill,
  delay,
}) => {
  return (
    <motion.circle
      initial={{ r: 0, cx, cy }}
      animate={{ r, cx, cy }}
      exit={{ r: 0 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
        delay: delay,
        duration: 0.6,
      }}
      fill={fill}
      opacity={0.7}
    />
  );
};

export default SentimentCircle;
