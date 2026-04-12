import React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
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

const Slider: React.FC<SliderProps> = ({
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
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div 
      className={cn("relative flex w-full items-center", className)}
      style={{ height: height + 2 * padding, padding: `${padding}px 0` }}
    >
      {/* Custom Track (visual only) */}
      <div 
        className="absolute w-full rounded-full overflow-hidden" 
        style={{ height, backgroundColor: inactiveColor }}
      >
        <div 
          className="h-full rounded-full transition-all duration-100"
          style={{ width: `${percentage}%`, backgroundColor: activeColor }}
        />
      </div>

      {/* Actual Input (invisible but functional) */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute z-10 w-full cursor-pointer appearance-none bg-transparent accent-transparent focus:outline-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-link [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-link [&::-moz-range-thumb]:border-none"
        style={{ height: height + 2 * padding }}
      />
    </div>
  );
};

export default Slider;
