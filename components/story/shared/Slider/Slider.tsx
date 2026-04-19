"use client";

import { FC, useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getOpaqueLightColor } from "./utils";

export interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  activeColor?: string;
  inactiveColor?: string;
  height?: number;
  padding?: number;
  className?: string;
}

const Slider: FC<SliderProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  activeColor = "#abe2fb",
  inactiveColor = "#e9e9e9",
  height = 6,
  padding = 10,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;
  
  const lightColor = useMemo(() => getOpaqueLightColor(activeColor), [activeColor]);

  // Handle global mouse/touch releases to ensure isDragging is reset
  useEffect(() => {
    if (!isDragging) return;
    const handleUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging]);

  const handleInteractionStart = () => {
    setIsDragging(true);
  };

  const isFullDark = isHovered || isDragging;

  return (
    <div 
      className={cn("relative flex w-full items-center group", className)}
      style={{ height: height + 2 * padding, padding: `${padding}px 0` }}
    >
      {/* Custom Track (visual only) */}
      <div 
        className="absolute w-full rounded-full overflow-hidden" 
        style={{ height, backgroundColor: inactiveColor }}
      >
        <div
          className="h-full rounded-full transition-colors duration-300"
          style={{ width: `${percentage}%`, backgroundColor: lightColor }}
        />
      </div>

      <div 
        className="absolute pointer-events-none z-20 flex items-center justify-center"
        style={{ 
          left: `calc(${percentage}% - 12px)`,
          width: 24, 
          height: 24 
        }}
      >
        <div 
          className="absolute w-full h-full rounded-full shadow-sm transition-colors duration-200"
          style={{ backgroundColor: isFullDark ? activeColor : lightColor }}
        />
        <motion.div 
          animate={{ scale: isFullDark ? 1 : 0.4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full h-full rounded-full"
          style={{ backgroundColor: activeColor }}
        />
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={handleInteractionStart}
        onTouchStart={handleInteractionStart}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute z-30 w-full cursor-pointer appearance-none bg-transparent accent-transparent focus:outline-none [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:appearance-none border-none"
        style={{ height: height + 2 * padding }}
      />
    </div>
  );
};

export default Slider;
