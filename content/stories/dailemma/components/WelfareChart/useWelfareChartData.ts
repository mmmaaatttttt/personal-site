import {
  alphaCO,
  alphaNE,
  linspace,
  ownerProfitChange,
  workerIncome,
} from "../../math";

const ALPHA_RANGE = linspace(0, 1, 100);
const Y_PAD_FACTOR = 0.08;

export interface WelfareChartData {
  ownerData: { x: number; y: number }[];
  workerData: { x: number; y: number }[];
  socialOptimum: number;
  marketOutcome: number;
  coOwnerProfit: number;
  neOwnerProfit: number;
  coWorkerIncome: number;
  neWorkerIncome: number;
  yMin: number;
  yMax: number;
  yPad: number;
}

export function useWelfareChartData(
  savings: number,
  demandLoss: number,
  difficulty: number,
  replacementRate: number,
  numFirms: number,
): WelfareChartData {
  const ownerData = ALPHA_RANGE.map((a) => ({
    x: a,
    y: ownerProfitChange(a, savings, demandLoss, difficulty),
  }));
  const workerData = ALPHA_RANGE.map((a) => ({
    x: a,
    y: workerIncome(a, replacementRate),
  }));

  const socialOptimum = alphaCO(savings, demandLoss, difficulty);
  const marketOutcome = alphaNE(savings, demandLoss, numFirms, difficulty);

  const coOwnerProfit = ownerProfitChange(
    socialOptimum,
    savings,
    demandLoss,
    difficulty,
  );
  const neOwnerProfit = ownerProfitChange(
    marketOutcome,
    savings,
    demandLoss,
    difficulty,
  );
  const coWorkerIncome = workerIncome(socialOptimum, replacementRate);
  const neWorkerIncome = workerIncome(marketOutcome, replacementRate);

  const allY = [...ownerData.map((d) => d.y), ...workerData.map((d) => d.y)];
  const yMin = Math.min(0, ...allY);
  const yMax = Math.max(1, ...allY);
  const yPad = (yMax - yMin) * Y_PAD_FACTOR;

  return {
    ownerData,
    workerData,
    socialOptimum,
    marketOutcome,
    coOwnerProfit,
    neOwnerProfit,
    coWorkerIncome,
    neWorkerIncome,
    yMin,
    yMax,
    yPad,
  };
}
