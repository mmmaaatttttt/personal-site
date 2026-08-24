"use client";

import useSliders from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import {
  DEFAULT_NON_RESPONDER_COMPLETION,
  DEFAULT_RESPONDER_COMPLETION,
  DEFAULT_TRUE_RATE,
  NON_RESPONDER_COMPLETION_KEY,
  RESPONDER_COMPLETION_KEY,
  TRUE_RATE_KEY,
} from "../../sliderStore";

export default function useAttritionBias() {
  const { values, sliderData } = useSliders([
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
      initialValue: DEFAULT_NON_RESPONDER_COMPLETION,
      min: 0,
      max: 1,
      step: 0.01,
      storageKey: NON_RESPONDER_COMPLETION_KEY,
      title: (v) => `Non-responsive completion rate: ${(v * 100).toFixed(0)}%`,
      color: COLORS.RED,
    },
  ]);
  const [
    trueResponseRate,
    baselineCompletionResponder,
    baselineCompletionNonResponder,
  ] = values;

  return {
    sliderData,
    trueResponseRate,
    baselineCompletionResponder,
    baselineCompletionNonResponder,
  };
}
