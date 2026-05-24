"use client";

import { motion } from "framer-motion";
import type { FC, MouseEvent, TouchEvent } from "react";

interface USStateProps {
  d: string;
  fill: string;
  index: number;
  title: string;
  body: string | string[];
  onMouseMove?: (
    title: string,
    body: string | string[],
  ) => (e: MouseEvent | TouchEvent) => void;
  onMouseLeave?: () => void;
}

const USState: FC<USStateProps> = ({
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
