import type { ActionValues } from "../../bonusMath";
import { softmaxProbabilities } from "../../bonusMath";
import type { SlotValue } from "../../data";
import { ROWS } from "./constants";

export interface ProbabilityRow {
  key: "stay" | SlotValue;
  label: string;
  expectedValue: number;
  random: number;
  current: number;
  optimized: number;
  isOptimal: boolean;
}

function toArray(actionValues: ActionValues): number[] {
  return ROWS.map((row) =>
    row.key === "stay"
      ? actionValues.stay
      : (actionValues.spin[row.key] as number),
  );
}

/**
 * Combines the true-optimal action values (used for the "random" and
 * "optimized" reference columns) and the current-temperature bounded-rational
 * action values (the "current strategy" column, which varies with the
 * slider) into one row per action, each with its three column probabilities.
 */
export function buildRows(
  optimalValues: ActionValues,
  boundedValues: ActionValues,
  temperature: number,
): ProbabilityRow[] {
  const optimalArray = toArray(optimalValues);
  const boundedArray = toArray(boundedValues);

  const random = softmaxProbabilities(optimalArray, Number.POSITIVE_INFINITY);
  const optimized = softmaxProbabilities(optimalArray, 0);
  const current = softmaxProbabilities(boundedArray, temperature);

  return ROWS.map((row, i) => ({
    key: row.key,
    label: row.label,
    expectedValue: optimalArray[i],
    random: random[i],
    current: current[i],
    optimized: optimized[i],
    isOptimal: optimized[i] === 1,
  }));
}
