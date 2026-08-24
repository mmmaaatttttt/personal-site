"use client";

import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { curveLinear, line as d3Line } from "d3-shape";
import { animate } from "framer-motion";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useTooltip } from "@/components/story/shared/Tooltip";
import useSliders from "@/hooks/useSliders";
import {
  boundedRationalExpectedValueCurve,
  machineExpectedValueCurve,
} from "../../bonusMath";
import { niceIntegerTickValues } from "../SlotMachine/niceIntegerTicks";
import {
  BOUNDED_LABEL,
  GRAPH_PADDING,
  HEIGHT,
  MAX_BONUS_SPINS,
  OPTIMAL_LABEL,
  SLIDER_CONFIG,
  WIDTH,
  X_TICK_COUNT,
  Y_TICK_COUNT,
} from "./constants";
import type { TooltipEntry } from "./TooltipDots";
import { temperatureFromSlider } from "./temperatureMath";

const TRANSITION_DURATION = 0.5;

export function useBonusSpinEvChart() {
  const { values, sliderData } = useSliders(SLIDER_CONFIG);
  const [sliderValue] = values;
  const tooltipState = useTooltip();

  // Optimal play doesn't depend on the slider, so this only needs to run once.
  const optimalCurve = useMemo(
    () => machineExpectedValueCurve(MAX_BONUS_SPINS),
    [],
  );

  const temperature = useMemo(
    () => temperatureFromSlider(sliderValue),
    [sliderValue],
  );

  // The bounded-rational curve is expensive to recompute (a DP over 330
  // states at every one of 151 spin counts), and the slider fires many
  // events per second while dragging. Deferring it keeps the slider itself
  // instantly responsive; the chart trails slightly behind and catches up
  // instead of blocking the main thread on every tick.
  const deferredTemperature = useDeferredValue(temperature);
  const isRecalculating = temperature !== deferredTemperature;

  const boundedCurve = useMemo(
    () =>
      boundedRationalExpectedValueCurve(MAX_BONUS_SPINS, deferredTemperature),
    [deferredTemperature],
  );

  // Shared by both series' dots, so hovering either curve's dot at a given
  // n shows both curves' values there — at high temperature the two dots
  // can sit close together, making it hard to land on the "right" one.
  const tooltipData: TooltipEntry[] = useMemo(
    () =>
      optimalCurve.map((optimalValue, n) => ({
        title: `n = ${n}`,
        body: [
          `${OPTIMAL_LABEL}: ${optimalValue.toFixed(3)}`,
          `${BOUNDED_LABEL}: ${boundedCurve[n].toFixed(3)}`,
        ],
      })),
    [optimalCurve, boundedCurve],
  );

  const xScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, MAX_BONUS_SPINS])
        .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]),
    [],
  );

  const [yMin, yMax] = extent([...optimalCurve, ...boundedCurve]) as [
    number,
    number,
  ];
  const yPad = (yMax - yMin) * 0.05;
  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain([yMin - yPad, yMax + yPad])
        .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]),
    [yMin, yMax, yPad],
  );

  const xTickValues = useMemo(
    () => niceIntegerTickValues(0, MAX_BONUS_SPINS, X_TICK_COUNT),
    [],
  );
  const yTickValues = useMemo(
    () =>
      niceIntegerTickValues(
        Math.floor(yMin - yPad),
        Math.ceil(yMax + yPad),
        Y_TICK_COUNT,
      ),
    [yMin, yMax, yPad],
  );

  const optimalGraphData = useMemo(
    () => optimalCurve.map((value, n) => ({ x: n, y: value })),
    [optimalCurve],
  );

  // Per-point animated pixel-Y positions for the bounded curve, so it eases
  // toward its new shape instead of snapping when the slider settles. Never
  // CSS-transition an SVG path's `d` (interpolation there is undefined
  // behavior and browsers animate it left-to-right); instead interpolate
  // the underlying pixel values in JS and rebuild `d` on every frame, same
  // approach as SlotMachine's TrendChart.
  const animYRef = useRef<number[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    const controls = boundedCurve.map((value, n) => {
      const target = yScale(value) as number;
      return animate(animYRef.current[n] ?? target, target, {
        duration: TRANSITION_DURATION,
        ease: "easeInOut",
        onUpdate: (v) => {
          animYRef.current[n] = v;
          setTick((t) => t + 1);
        },
      });
    });

    return () => {
      for (const control of controls) control?.stop();
    };
  }, [boundedCurve, yScale]);

  const animatedBoundedY = boundedCurve.map(
    (value, n) => animYRef.current[n] ?? (yScale(value) as number),
  );

  const boundedLinePath = d3Line<number>()
    .x((_, i) => xScale(i) as number)
    .y((_, i) => animatedBoundedY[i])
    .curve(curveLinear)(boundedCurve) as string;

  return {
    sliderData,
    xScale,
    yScale,
    xTickValues,
    yTickValues,
    optimalCurve,
    optimalGraphData,
    boundedCurve,
    boundedLinePath,
    animatedBoundedY,
    tooltipData,
    isRecalculating,
    ...tooltipState,
  };
}
