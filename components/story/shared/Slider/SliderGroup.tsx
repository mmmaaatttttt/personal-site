"use client";

import type { FC } from "react";
import { cn } from "@/lib/utils";
import FlexContainer from "../FlexContainer";
import LabeledSlider from "./LabeledSlider";

interface SliderData {
  min: number;
  max: number;
  step?: number;
  value: number;
  handleValueChange: (val: number) => void;
  title: string | ((val: number) => string);
  color: string;
  key?: string | number;
  tickCount?: number;
}

interface SliderGroupProps {
  data: SliderData[];
  column?: boolean;
  compact?: boolean;
}

const SliderGroup: FC<SliderGroupProps> = ({
  data,
  column = true,
  compact = false,
}) => {
  const sliders = data.map((d, i) => {
    const title =
      typeof d.title === "function" ? d.title(d.value) : d.title || "";
    return (
      <div
        key={d.key ?? i}
        className={cn(compact ? "my-0" : "m-1", "flex-1 min-w-0")}
      >
        <LabeledSlider
          min={d.min}
          max={d.max}
          step={d.step}
          value={d.value}
          handleValueChange={d.handleValueChange}
          title={title}
          color={d.color}
          tickCount={d.tickCount}
          compact={compact}
        />
      </div>
    );
  });

  return (
    <FlexContainer
      column={column}
      cross="center"
      flex={data.length}
      className="min-w-0"
    >
      {sliders}
    </FlexContainer>
  );
};

export default SliderGroup;
