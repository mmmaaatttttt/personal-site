"use client";

import { useMemo } from "react";
import useSliders from "@/hooks/useSliders";
import { clamp } from "@/utils/mathHelpers";
import { YEAR_SLIDER_COLOR, YEAR_STORAGE_KEY } from "./constants";

export default function useYearSlider(
  minYear: number,
  maxYear: number,
  initialYear: number,
) {
  const sliderConfig = useMemo(
    () => [
      {
        initialValue: initialYear,
        min: minYear,
        max: maxYear,
        step: 1,
        title: (val: number) => `Year: ${val}`,
        color: YEAR_SLIDER_COLOR,
        storageKey: YEAR_STORAGE_KEY,
      },
    ],
    [minYear, maxYear, initialYear],
  );

  const { values, sliderData } = useSliders(sliderConfig);
  const year = clamp(values[0], minYear, maxYear);
  const clampedSliderData = useMemo(
    () => sliderData.map((slider) => ({ ...slider, value: year })),
    [sliderData, year],
  );

  return { year, sliderData: clampedSliderData };
}
