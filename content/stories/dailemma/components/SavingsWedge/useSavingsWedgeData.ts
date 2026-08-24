import { clamp } from "@/utils/mathHelpers";
import { alphaCO, alphaNE, computeOverAutomation, linspace } from "../../math";

const DELTA_MIN = -0.8;
const DELTA_MAX = 0.8;
const DELTA_RANGE = linspace(DELTA_MIN, DELTA_MAX, 100);
const N_FIXED = 2;

export { DELTA_MAX, DELTA_MIN };

export interface SavingsWedgeData {
  neData: { x: number; y: number }[];
  coData: { x: number; y: number }[];
  currentNE: number;
  currentCO: number;
  overPct: number | null;
  clampedDelta: number;
}

export function useSavingsWedgeData(
  savings: number,
  demandLoss: number,
  difficulty: number,
): SavingsWedgeData {
  const delta = savings - demandLoss;
  const clampedDelta = clamp(delta, DELTA_MIN, DELTA_MAX);

  const neData = DELTA_RANGE.map((d) => ({
    x: d,
    y: alphaNE(d + demandLoss, demandLoss, N_FIXED, difficulty),
  }));
  const coData = DELTA_RANGE.map((d) => ({
    x: d,
    y: alphaCO(d + demandLoss, demandLoss, difficulty),
  }));

  const { currentNE, currentCO, overPct } = computeOverAutomation(
    savings,
    demandLoss,
    N_FIXED,
    difficulty,
  );

  return { neData, coData, currentNE, currentCO, overPct, clampedDelta };
}
