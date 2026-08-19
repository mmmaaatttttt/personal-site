"use client";

import { useMemo } from "react";
import useSliders from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import { buildCobwebPath, findFixedPoints } from "../../mathUtils";
import {
  DEFAULT_NON_RESPONDER_COMPLETION,
  DEFAULT_RESPONDER_COMPLETION,
  DEFAULT_TRUE_RATE,
  NON_RESPONDER_COMPLETION_KEY,
  RESPONDER_COMPLETION_KEY,
  TRUE_RATE_KEY,
} from "../../sliderStore";
import {
  observedResponseRate,
  observedResponseRatePrime,
  partialAdjustment,
  partialAdjustmentPrime,
} from "./utils";

const STEPS = 20;

export default function useAttritionFeedback() {
  const { values, sliderData } = useSliders([
    {
      initialValue: 0.55,
      min: 0,
      max: 1,
      step: 0.01,
      title: (v) => `Initial contract price $${v.toFixed(2)}`,
      color: COLORS.ORANGE,
    },
    {
      initialValue: DEFAULT_TRUE_RATE,
      min: 0,
      max: 1,
      step: 0.01,
      storageKey: TRUE_RATE_KEY,
      title: (v) => `True efficacy rate: ${(v * 100).toFixed(0)}%`,
      color: COLORS.PURPLE,
    },
    {
      initialValue: DEFAULT_RESPONDER_COMPLETION,
      min: 0,
      max: 1,
      step: 0.01,
      storageKey: RESPONDER_COMPLETION_KEY,
      title: (v) => `Responsive completion rate: ${(v * 100).toFixed(0)}%`,
      color: COLORS.DARK_GREEN,
    },
    {
      initialValue: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
      title: (v) =>
        `Market influence on responsive group: ${(v * 100).toFixed(0)}%`,
      color: COLORS.DARK_GREEN,
    },
    {
      initialValue: DEFAULT_NON_RESPONDER_COMPLETION,
      min: 0,
      max: 1,
      step: 0.01,
      storageKey: NON_RESPONDER_COMPLETION_KEY,
      title: (v) => `Non-responsive completion rate: ${(v * 100).toFixed(0)}%`,
      color: COLORS.RED,
    },
    {
      initialValue: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      title: (v) =>
        `Market influence on non-responsive group: ${(v * 100).toFixed(0)}%`,
      color: COLORS.RED,
    },
    {
      initialValue: 0.2,
      min: 0,
      max: 1,
      step: 0.01,
      title: (v) => `Market sensitivity to attrition: ${v.toFixed(2)}`,
      color: COLORS.DARK_GRAY,
    },
  ]);
  const [
    initialContractPrice,
    trueResponseRate,
    baselineCompletionResponder,
    responderMarketCompletion,
    baselineCompletionNonResponder,
    nonResponderMarketCompletion,
    adjustmentSpeed,
  ] = values;

  const map = useMemo(
    () => (publishedProbability: number) =>
      partialAdjustment(
        observedResponseRate(
          publishedProbability,
          trueResponseRate,
          baselineCompletionResponder,
          baselineCompletionNonResponder,
          responderMarketCompletion,
          nonResponderMarketCompletion,
        ),
        publishedProbability,
        adjustmentSpeed,
      ),
    [
      trueResponseRate,
      baselineCompletionResponder,
      baselineCompletionNonResponder,
      responderMarketCompletion,
      nonResponderMarketCompletion,
      adjustmentSpeed,
    ],
  );
  const mapDerivative = useMemo(
    () => (publishedProbability: number) =>
      partialAdjustmentPrime(
        observedResponseRatePrime(
          publishedProbability,
          trueResponseRate,
          baselineCompletionResponder,
          baselineCompletionNonResponder,
          responderMarketCompletion,
          nonResponderMarketCompletion,
        ),
        adjustmentSpeed,
      ),
    [
      trueResponseRate,
      baselineCompletionResponder,
      baselineCompletionNonResponder,
      responderMarketCompletion,
      nonResponderMarketCompletion,
      adjustmentSpeed,
    ],
  );

  const targetMap = useMemo(
    () => (publishedProbability: number) =>
      observedResponseRate(
        publishedProbability,
        trueResponseRate,
        baselineCompletionResponder,
        baselineCompletionNonResponder,
        responderMarketCompletion,
        nonResponderMarketCompletion,
      ),
    [
      trueResponseRate,
      baselineCompletionResponder,
      baselineCompletionNonResponder,
      responderMarketCompletion,
      nonResponderMarketCompletion,
    ],
  );

  const cobwebPath = useMemo(
    () => buildCobwebPath(map, initialContractPrice, STEPS),
    [map, initialContractPrice],
  );
  const fixedPoints = useMemo(
    () => findFixedPoints(targetMap, mapDerivative),
    [targetMap, mapDerivative],
  );

  return { sliderData, map, cobwebPath, fixedPoints, trueResponseRate };
}
