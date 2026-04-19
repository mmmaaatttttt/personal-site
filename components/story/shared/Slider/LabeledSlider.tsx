"use client";

import { FC } from "react";
import { Minus, Plus, LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import Slider from "./Slider";
import SliderTicks from "./SliderTicks";
import { hexToRgba } from "@/utils/styles";
import { THEME_OPACITY } from "./constants";

interface LabeledSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  handleValueChange: (val: number) => void;
  title: string | React.ReactNode;
  color: string;
  sliderHeight?: number;
  sliderPadding?: number;
  tickCount?: number;
  minIcon?: string;
  maxIcon?: string;
  fadeIcons?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  minus: Minus,
  plus: Plus,
};

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
  minIcon = "minus",
  maxIcon = "plus",
  fadeIcons = false,
}) => {
  const computedStep = step ?? (max - min) / 100;
  const fraction = (value - min) / (max - min);
  const leftOpacity = fadeIcons ? 1 - fraction : 1;
  const rightOpacity = fadeIcons ? fraction : 1;

  const MinIconComp = iconMap[minIcon] || Minus;
  const MaxIconComp = iconMap[maxIcon] || Plus;
  const lightColor = color.startsWith("#")
    ? hexToRgba(color, THEME_OPACITY)
    : color;

  return (
    <div className="flex w-full flex-col items-center text-center">
      {title && (
        <div className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
          {title}
        </div>
      )}
      <section className="flex w-full items-center gap-4">
        <div className="w-8 shrink-0" style={{ opacity: leftOpacity }}>
          <Icon icon={MinIconComp} size={18} style={{ color: lightColor }} />
        </div>
        <div className="relative flex-1">
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
        <div className="w-8 shrink-0" style={{ opacity: rightOpacity }}>
          <Icon icon={MaxIconComp} size={18} style={{ color: lightColor }} />
        </div>
      </section>
    </div>
  );
};

export default LabeledSlider;
