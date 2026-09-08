"use client";

import { useState } from "react";
import useSliders from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import {
  DEFAULT_GUARANTEED_MULTIPLIER,
  DEFAULT_RANDOM_COST,
  GUARANTEED_MULTIPLIER_KEY,
  MAX_GUARANTEED_MULTIPLIER,
  MAX_RANDOM_COST,
  MIN_GUARANTEED_MULTIPLIER,
  MIN_RANDOM_COST,
  RANDOM_COST_KEY,
  SWITCH_POINT_KEY,
} from "../../sliderStore";
import { DEFAULT_SPEED, MAX_SPEED, MIN_SPEED, SPEED_STEP } from "./constants";
import { useStandeeRun } from "./useStandeeRun";

export function useMixedStrategyExplorer(numStandees: number) {
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  const { values, sliderData } = useSliders([
    {
      key: "randomCost",
      initialValue: DEFAULT_RANDOM_COST,
      storageKey: RANDOM_COST_KEY,
      min: MIN_RANDOM_COST,
      max: MAX_RANDOM_COST,
      step: 1,
      title: (val: number) =>
        `Random Cost per Standee: ${val} coin${val !== 1 ? "s" : ""}`,
      color: COLORS.BLUE,
    },
    {
      key: "guaranteedMultiplier",
      initialValue: DEFAULT_GUARANTEED_MULTIPLIER,
      storageKey: GUARANTEED_MULTIPLIER_KEY,
      min: MIN_GUARANTEED_MULTIPLIER,
      max: MAX_GUARANTEED_MULTIPLIER,
      step: 1,
      title: (val: number) =>
        `Guaranteed Cost Per Standee: ${val}x Random Cost`,
      color: COLORS.MAROON,
    },
    {
      key: "switchPoint",
      initialValue: Math.round(numStandees / 2),
      storageKey: SWITCH_POINT_KEY,
      min: 0,
      max: numStandees,
      step: 1,
      title: (val: number) => `Strategy Switch Point: ${val}`,
      color: COLORS.GREEN,
    },
  ]);
  const [randomCost, guaranteedMultiplier, rawSwitchPoint] = values;
  const guaranteedCost = randomCost * guaranteedMultiplier;
  const clampedSwitchPoint = Math.min(rawSwitchPoint, numStandees);

  const settingsSliderData = sliderData.map((slider) =>
    slider.key === "switchPoint"
      ? { ...slider, value: clampedSwitchPoint }
      : slider,
  );

  const {
    tallies,
    randomDraws,
    guaranteedDraws,
    lastDrawnIndex,
    playing,
    isFinished,
    toggle,
    reset,
  } = useStandeeRun(numStandees, 0, clampedSwitchPoint, speed);

  const totalCost = randomDraws * randomCost + guaranteedDraws * guaranteedCost;
  const totalDraws = randomDraws + guaranteedDraws;

  const speedSliderData = [
    {
      key: "speed",
      value: speed,
      handleValueChange: setSpeed,
      min: MIN_SPEED,
      max: MAX_SPEED,
      step: SPEED_STEP,
      title: (val: number) => `Speed: ${val.toFixed(1)}x`,
      color: COLORS.GREEN,
    },
  ];

  return {
    tallies,
    lastDrawnIndex,
    totalCost,
    totalDraws,
    playing,
    isFinished,
    toggle,
    reset,
    settingsSliderData,
    speedSliderData,
  };
}
