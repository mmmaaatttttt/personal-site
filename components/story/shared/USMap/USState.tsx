"use client";

import React from "react";
import { motion } from "framer-motion";

interface USStateProps {
  d: string;
  fill: string;
  index: number;
  title: string;
  body: string | string[];
  onMouseMove?: (title: string, body: string | string[]) => (e: React.MouseEvent | React.TouchEvent) => void;
  onMouseLeave?: () => void;
}

const USState: React.FC<USStateProps> = ({
  d,
  fill,
  index,
  title,
  body,
  onMouseMove,
  onMouseLeave,
}) => {
  return (
    <motion.path
      d={d}
      fill={fill}
      stroke="white"
      strokeWidth={4}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, fill }}
      transition={{ duration: 0.5, delay: index * 0.005 }}
      onMouseMove={onMouseMove?.(title, body)}
      onMouseLeave={onMouseLeave}
      onTouchStart={onMouseMove?.(title, body)}
      onTouchEnd={onMouseLeave}
      className="cursor-pointer"
    />
  );
};

export default USState;
