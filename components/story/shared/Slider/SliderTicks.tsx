"use client";

import { FC, useMemo } from "react";
import { getOpaqueLightColor } from "./utils";

interface SliderTicksProps {
  count: number;
  fractionFilled: number;
  activeColor: string;
  inactiveColor?: string;
  height: number;
  padding: number;
}

const SliderTicks: FC<SliderTicksProps> = ({
  count,
  fractionFilled,
  activeColor,
  inactiveColor = "#e9e9e9",
  height,
  padding,
}) => {
  const lightColor = useMemo(() => getOpaqueLightColor(activeColor), [activeColor]);
  
  if (count <= 0) return null;

  return (
    <div className="flex w-full justify-between px-0 absolute top-0 pointer-events-none" style={{ height: height + 2 * padding, padding: `${padding}px 0` }}>
      {Array.from({ length: count }, (_, i) => {
        const isFilled = i / (count - 1) <= fractionFilled;
        return (
          <div
            key={i}
            className="rounded-full transition-colors duration-200"
            style={{
              width: height,
              height: height,
              backgroundColor: isFilled ? lightColor : inactiveColor,
            }}
          />
        );
      })}
    </div>
  );
};

export default SliderTicks;
