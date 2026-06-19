export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function alphaNE(
  savings: number,
  demandLoss: number,
  numFirms: number,
  difficulty: number,
): number {
  if (difficulty === 0) return savings > demandLoss / numFirms ? 1 : 0;
  return clamp01((savings - demandLoss / numFirms) / difficulty);
}

export function alphaCO(
  savings: number,
  demandLoss: number,
  difficulty: number,
): number {
  if (difficulty === 0) return savings > demandLoss ? 1 : 0;
  return clamp01((savings - demandLoss) / difficulty);
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
