import { alphaCO, alphaNE } from "../../math";

const SIGNIFICANCE_THRESHOLD = 0.001;

export interface WedgeData {
  neData: { x: number; y: number }[];
  coData: { x: number; y: number }[];
  currentNE: number;
  currentCO: number;
  overPct: number | null;
}

export function useWedgeData(
  savings: number,
  demandLoss: number,
  difficulty: number,
  numFirms: number,
  ns: number[],
): WedgeData {
  const neData = ns.map((n) => ({
    x: n,
    y: alphaNE(savings, demandLoss, n, difficulty),
  }));
  const coData = ns.map((n) => ({
    x: n,
    y: alphaCO(savings, demandLoss, difficulty),
  }));

  const currentNE = alphaNE(savings, demandLoss, numFirms, difficulty);
  const currentCO = alphaCO(savings, demandLoss, difficulty);
  const overPct =
    currentCO > SIGNIFICANCE_THRESHOLD
      ? Math.round(((currentNE - currentCO) / currentCO) * 100)
      : null;

  return { neData, coData, currentNE, currentCO, overPct };
}
