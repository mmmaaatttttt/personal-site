"use client";

import { useDeferredValue, useMemo } from "react";
import useSliders from "@/hooks/useSliders";
import { boundedRationalActionValues, evaluateActions } from "../../bonusMath";
import { temperatureFromSlider } from "../BonusSpinEvChart/temperatureMath";
import { buildRows } from "./buildRows";
import { EXAMPLE_STATE, SLIDER_CONFIGS } from "./constants";

export function useStrategyProbabilityTable() {
  const { values, sliderData } = useSliders(SLIDER_CONFIGS);
  const [sliderValue, spinsRemaining] = values;

  const temperature = useMemo(
    () => temperatureFromSlider(sliderValue),
    [sliderValue],
  );

  // Same reasoning as useBonusSpinEvChart: the bounded-rational recursion is
  // expensive enough that deferring it keeps both sliders responsive while
  // dragging.
  const deferredTemperature = useDeferredValue(temperature);
  const deferredSpinsRemaining = useDeferredValue(spinsRemaining);
  const isRecalculating =
    temperature !== deferredTemperature ||
    spinsRemaining !== deferredSpinsRemaining;

  const optimalValues = useMemo(
    () => evaluateActions(EXAMPLE_STATE, deferredSpinsRemaining),
    [deferredSpinsRemaining],
  );

  const boundedValues = useMemo(
    () =>
      boundedRationalActionValues(
        EXAMPLE_STATE,
        deferredSpinsRemaining,
        deferredTemperature,
      ),
    [deferredSpinsRemaining, deferredTemperature],
  );

  const rows = useMemo(
    () => buildRows(optimalValues, boundedValues, deferredTemperature),
    [optimalValues, boundedValues, deferredTemperature],
  );

  return { sliderData, rows, isRecalculating };
}
