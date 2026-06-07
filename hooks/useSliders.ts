"use client";

import { useCallback, useMemo, useState } from "react";

export interface SliderInitialData {
  initialValue: number;
  min: number;
  max: number;
  step?: number;
  title: string | ((val: number) => string);
  color: string;
  key?: string | number;
  tickCount?: number;
}

export interface SliderData extends SliderInitialData {
  value: number;
  handleValueChange: (val: number) => void;
}

export default function useSliders(initialData: SliderInitialData[]): {
  values: number[];
  sliderData: SliderData[];
} {
  const [values, setValues] = useState<number[]>(() =>
    initialData.map((d) => d.initialValue),
  );

  const handleValueChange = useCallback((idx: number, newVal: number) => {
    setValues((prev) => {
      const next = [...prev];
      next[idx] = newVal;
      return next;
    });
  }, []);

  const sliderData = useMemo(
    () =>
      initialData.map((d, i) => ({
        ...d,
        value: values[i],
        handleValueChange: (val: number) => handleValueChange(i, val),
      })),
    [initialData, values, handleValueChange],
  );

  // values: flat array for easy destructuring in the component body
  // sliderData: enriched objects that SliderGroup needs (.value per item for controlled rendering)
  return { values, sliderData };
}
