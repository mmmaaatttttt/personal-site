import { clamp } from "@/utils/mathHelpers";

/**
 * Min/max of a series of chart y-values, each side optionally forced to
 * include a set of anchor values (e.g. [0] so a profit/loss chart always
 * shows the zero line, or [0, 1] so a probability-range chart always shows
 * both ends). Anchors are separate per side since not every chart wants the
 * same forcing on both ends.
 */
export function computeYExtent(
  values: number[],
  minAnchors: number[] = [],
  maxAnchors: number[] = [],
): { yMin: number; yMax: number } {
  return {
    yMin: Math.min(...values, ...minAnchors),
    yMax: Math.max(...values, ...maxAnchors),
  };
}

/** Padding to add above/below a [yMin, yMax] domain, as a fraction of its span. */
export function padYDomain(
  yMin: number,
  yMax: number,
  padFactor: number,
): number {
  return (yMax - yMin) * padFactor;
}

/**
 * Automation rate chosen by a coalition of `coalitionSize` firms that jointly
 * maximize their combined profit, while the remaining firms play Nash.
 * At coalitionSize=1 this equals the Nash equilibrium rate; at coalitionSize=N
 * it equals the cooperative rate.
 */
export function coalitionAutomationRate(
  savings: number,
  demandLoss: number,
  numFirms: number,
  difficulty: number,
  coalitionSize: number,
): number {
  if (difficulty === 0) {
    return savings > (coalitionSize * demandLoss) / numFirms ? 1 : 0;
  }
  return clamp(
    (savings - (coalitionSize * demandLoss) / numFirms) / difficulty,
    0,
    1,
  );
}

/**
 * The per-task automation tax rate that fully corrects the demand externality,
 * bringing the Nash equilibrium to the cooperative optimum.
 */
export function optimalAutomationTax(
  demandLoss: number,
  numFirms: number,
): number {
  return demandLoss * (1 - 1 / numFirms);
}

/**
 * Nash equilibrium automation rate when a per-task automation tax is applied.
 * At automationTaxRate = optimalAutomationTax(demandLoss, numFirms) this
 * equals the cooperative rate.
 */
export function nashRateWithAutomationTax(
  savings: number,
  demandLoss: number,
  numFirms: number,
  difficulty: number,
  automationTaxRate: number,
): number {
  if (difficulty === 0) {
    return savings - automationTaxRate > demandLoss / numFirms ? 1 : 0;
  }
  return clamp(
    (savings - automationTaxRate - demandLoss / numFirms) / difficulty,
    0,
    1,
  );
}

/**
 * How many "independent" competitors each firm effectively faces when workers
 * hold equity stakes. Higher equity or higher sector-spending fraction reduces
 * this number, making each firm internalize more of the demand loss it creates.
 */
export function effectiveMarketSize(
  numFirms: number,
  equityShare: number,
  sectorSpendingFraction: number,
): number {
  return numFirms - sectorSpendingFraction * equityShare * (numFirms - 1);
}

/**
 * Nash equilibrium automation rate when workers hold equity stakes in firms.
 * At equityShare=0 this equals the standard Nash rate; as equityShare rises
 * it approaches (but for sectorSpendingFraction < 1 never reaches) the
 * cooperative rate.
 */
export function nashRateWithWorkerEquity(
  savings: number,
  demandLoss: number,
  numFirms: number,
  difficulty: number,
  equityShare: number,
  sectorSpendingFraction: number,
): number {
  const effN = effectiveMarketSize(
    numFirms,
    equityShare,
    sectorSpendingFraction,
  );
  if (difficulty === 0) return savings > demandLoss / effN ? 1 : 0;
  return clamp((savings - demandLoss / effN) / difficulty, 0, 1);
}
