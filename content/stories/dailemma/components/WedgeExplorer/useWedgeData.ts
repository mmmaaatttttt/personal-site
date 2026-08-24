import { alphaCO, alphaNE, computeOverAutomation } from "../../math";

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

  const { currentNE, currentCO, overPct } = computeOverAutomation(
    savings,
    demandLoss,
    numFirms,
    difficulty,
  );

  return { neData, coData, currentNE, currentCO, overPct };
}
