"use client";

import { type FC, type ReactNode, useCallback, useMemo, useState } from "react";
import ColumnLayout from "../ColumnLayout";
import NarrowContainer from "../NarrowContainer";
import SliderGroup from "./SliderGroup";

interface SliderInitialData {
  initialValue: number;
  min: number;
  max: number;
  step?: number;
  title: string | ((val: number) => string);
  color: string;
  key?: string | number;
  tickCount?: number;
}

interface SliderProviderProps {
  initialData: SliderInitialData[];
  column?: boolean;
  fullWidthAt?: "sm" | "md" | "lg" | "xl";
  render: (values: number[]) => ReactNode;
  width?: string;
  compact?: boolean;
}

const SliderProvider: FC<SliderProviderProps> = ({
  initialData = [],
  column = true,
  fullWidthAt = "sm",
  render,
  width = "75%",
  compact = false,
}) => {
  const [sliderValues, setSliderValues] = useState<number[]>(() =>
    initialData && Array.isArray(initialData)
      ? initialData.map((d) => d.initialValue)
      : [],
  );

  const handleValueChange = useCallback((idx: number, newVal: number) => {
    setSliderValues((prev) => {
      const next = [...prev];
      next[idx] = newVal;
      return next;
    });
  }, []);

  const dataWithHandlers = useMemo(
    () =>
      initialData && Array.isArray(initialData)
        ? initialData.map((d, i) => ({
            ...d,
            value: sliderValues[i],
            handleValueChange: (val: number) => handleValueChange(i, val),
          }))
        : [],
    [initialData, sliderValues, handleValueChange],
  );

  if (!initialData || !Array.isArray(initialData) || initialData.length === 0)
    return null;

  const numSliders = sliderValues.length;
  const sliderGroup = (
    <SliderGroup data={dataWithHandlers} column={column} compact={compact} />
  );
  const rendered = typeof render === "function" ? render(sliderValues) : null;

  return numSliders < 4 ? (
    <NarrowContainer width={width} fullWidthAt={fullWidthAt}>
      {sliderGroup}
      {rendered}
    </NarrowContainer>
  ) : (
    <ColumnLayout break="sm">
      <div className="flex flex-col justify-center h-full">{sliderGroup}</div>
      {rendered}
    </ColumnLayout>
  );
};

export default SliderProvider;
