import { clamp } from "@/utils/mathHelpers";

export function alphaNE(
  savings: number,
  demandLoss: number,
  numFirms: number,
  difficulty: number,
): number {
  if (difficulty === 0) return savings > demandLoss / numFirms ? 1 : 0;
  return clamp((savings - demandLoss / numFirms) / difficulty, 0, 1);
}

export function alphaCO(
  savings: number,
  demandLoss: number,
  difficulty: number,
): number {
  if (difficulty === 0) return savings > demandLoss ? 1 : 0;
  return clamp((savings - demandLoss) / difficulty, 0, 1);
}

const SIGNIFICANCE_THRESHOLD = 0.001;

export interface OverAutomation {
  currentNE: number;
  currentCO: number;
  overPct: number | null;
}

/**
 * The Nash-equilibrium vs. cooperative automation share at a given savings
 * level, and the percentage by which NE over-automates relative to CO.
 * Shared by WedgeExplorer and SavingsWedge, which both plot this same
 * quantity against a different x-axis (number of firms vs. savings delta).
 */
export function computeOverAutomation(
  savings: number,
  demandLoss: number,
  numFirms: number,
  difficulty: number,
): OverAutomation {
  const currentNE = alphaNE(savings, demandLoss, numFirms, difficulty);
  const currentCO = alphaCO(savings, demandLoss, difficulty);
  const overPct =
    currentCO > SIGNIFICANCE_THRESHOLD
      ? Math.round(((currentNE - currentCO) / currentCO) * 100)
      : null;
  return { currentNE, currentCO, overPct };
}

export function ownerProfitChange(
  automationShare: number,
  savings: number,
  demandLoss: number,
  difficulty: number,
): number {
  return (
    (savings - demandLoss) * automationShare -
    (difficulty / 2) * automationShare * automationShare
  );
}

export function workerIncome(
  automationShare: number,
  replacementRate: number,
): number {
  return 1 - (1 - replacementRate) * automationShare;
}

export function linspace(start: number, end: number, n: number): number[] {
  if (n <= 1) return [start];
  const step = (end - start) / (n - 1);
  return Array.from({ length: n }, (_, i) => start + i * step);
}

export interface PdPayoffs {
  bothAutomate: number;
  automate: number;
  donot: number;
  neitherAutomates: number;
}

export function pdPayoffs(savings: number, demandLoss: number): PdPayoffs {
  return {
    bothAutomate: savings - demandLoss,
    automate: savings - demandLoss / 2,
    donot: -(demandLoss / 2),
    neitherAutomates: 0,
  };
}
