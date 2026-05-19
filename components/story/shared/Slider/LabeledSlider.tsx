"use client";

import type { FC, ReactNode } from "react";
import Slider from "./Slider";
import SliderTicks from "./SliderTicks";

interface LabeledSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  handleValueChange: (val: number) => void;
  title: string | ReactNode;
  color: string;
  sliderHeight?: number;
  sliderPadding?: number;
  tickCount?: number;
  compact?: boolean;
}

const LabeledSlider: FC<LabeledSliderProps> = ({
  min,
  max,
  step,
  value,
  handleValueChange,
  title,
  color,
  sliderHeight = 6,
  sliderPadding = 10,
  tickCount = 2,
  compact = false,
}) => {
  const computedStep = step ?? (max - min) / 100;
  const fraction = (value - min) / (max - min);

  return (
    <div className="flex w-full flex-col items-center text-center">
      {title && (
        <div
          className={`${compact ? "mb-0" : "mb-2"} text-xs font-semibold tracking-wider text-gray-500`}
        >
          {title}
        </div>
      )}
      <div className="relative w-full">
        <Slider
          min={min}
          max={max}
          step={computedStep}
          value={value}
          onChange={handleValueChange}
          activeColor={color}
          height={sliderHeight}
          padding={sliderPadding}
        />
        <SliderTicks
          count={tickCount}
          fractionFilled={fraction}
          activeColor={color}
          height={sliderHeight}
          padding={sliderPadding}
        />
      </div>
    </div>
  );
};

export default LabeledSlider;
