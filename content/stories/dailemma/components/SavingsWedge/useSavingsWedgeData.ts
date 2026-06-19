import { alphaCO, alphaNE, linspace } from "../../math";

const DELTA_MIN = -0.8;
const DELTA_MAX = 0.8;
const DELTA_RANGE = linspace(DELTA_MIN, DELTA_MAX, 100);
const N_FIXED = 2;
const SIGNIFICANCE_THRESHOLD = 0.001;

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
  const clampedDelta = Math.max(DELTA_MIN, Math.min(DELTA_MAX, delta));

  const neData = DELTA_RANGE.map((d) => ({
    x: d,
    y: alphaNE(d + demandLoss, demandLoss, N_FIXED, difficulty),
  }));
  const coData = DELTA_RANGE.map((d) => ({
    x: d,
    y: alphaCO(d + demandLoss, demandLoss, difficulty),
  }));

  const currentNE = alphaNE(savings, demandLoss, N_FIXED, difficulty);
  const currentCO = alphaCO(savings, demandLoss, difficulty);
  const overPct =
    currentCO > SIGNIFICANCE_THRESHOLD
      ? Math.round(((currentNE - currentCO) / currentCO) * 100)
      : null;

  return { neData, coData, currentNE, currentCO, overPct, clampedDelta };
}
