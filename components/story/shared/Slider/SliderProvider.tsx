"use client";

import React, { useState, useMemo } from "react";
import NarrowContainer from "../NarrowContainer";
import ColumnLayout from "../ColumnLayout";
import SliderGroup from "./SliderGroup";

interface SliderInitialData {
  initialValue: number;
  min: number;
  max: number;
  step?: number;
  title: string | ((val: number) => string);
  color: string;
  [key: string]: any;
}

interface SliderProviderProps {
  initialData: SliderInitialData[];
  column?: boolean;
  fullWidthAt?: "sm" | "md" | "lg" | "xl";
  render: (values: number[]) => React.ReactNode;
  width?: string;
}

const SliderProvider: React.FC<SliderProviderProps> = ({
  initialData = [],
  column = true,
  fullWidthAt = "sm",
  render,
  width = "70%",
}) => {
  const [sliderValues, setSliderValues] = useState<number[]>(() =>
    initialData && Array.isArray(initialData) ? initialData.map((d) => d.initialValue) : []
  );

  const handleValueChange = (idx: number, newVal: number) => {
    setSliderValues((prev) => {
      const next = [...prev];
      next[idx] = newVal;
      return next;
    });
  };

  const dataWithHandlers = useMemo(
    () =>
      initialData && Array.isArray(initialData) ? initialData.map((d, i) => ({
        ...d,
        value: sliderValues[i],
        handleValueChange: (val: number) => handleValueChange(i, val),
      })) : [],
    [initialData, sliderValues]
  );

  const mainContent = (
    <>
      <SliderGroup data={dataWithHandlers} column={column} />
      {typeof render === "function" ? render(sliderValues) : null}
    </>
  );

  const numSliders = sliderValues.length;

  return numSliders < 4 ? (
    <NarrowContainer width={width} fullWidthAt={fullWidthAt}>
      {mainContent}
    </NarrowContainer>
  ) : (
    <ColumnLayout break="sm">{mainContent}</ColumnLayout>
  );
};

export default SliderProvider;
