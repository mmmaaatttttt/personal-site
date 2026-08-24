import {
  alphaCO,
  alphaNE,
  linspace,
  ownerProfitChange,
  workerIncome,
} from "../../../dailemma/math";
import { computeYExtent, padYDomain } from "../../math";

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
  workerYMin: number;
  workerYMax: number;
  workerYPad: number;
}

export function useWelfareChartData(
  savings: number,
  demandLoss: number,
  difficulty: number,
  replacementRate: number,
  numFirms: number,
): WelfareChartData {
  // Retraining/reemployment replaces a share of displaced workers' income,
  // so it shrinks the demand loss itself, not just the income hit.
  const effectiveDemandLoss = demandLoss * (1 - replacementRate);

  const ownerData = ALPHA_RANGE.map((a) => ({
    x: a,
    y: ownerProfitChange(a, savings, effectiveDemandLoss, difficulty),
  }));
  const workerData = ALPHA_RANGE.map((a) => ({
    x: a,
    y: workerIncome(a, replacementRate),
  }));

  const socialOptimum = alphaCO(savings, effectiveDemandLoss, difficulty);
  const marketOutcome = alphaNE(
    savings,
    effectiveDemandLoss,
    numFirms,
    difficulty,
  );

  const coOwnerProfit = ownerProfitChange(
    socialOptimum,
    savings,
    effectiveDemandLoss,
    difficulty,
  );
  const neOwnerProfit = ownerProfitChange(
    marketOutcome,
    savings,
    effectiveDemandLoss,
    difficulty,
  );
  const coWorkerIncome = workerIncome(socialOptimum, replacementRate);
  const neWorkerIncome = workerIncome(marketOutcome, replacementRate);

  const ownerY = ownerData.map((d) => d.y);
  const { yMin, yMax } = computeYExtent(ownerY, [0], [1]);
  const yPad = padYDomain(yMin, yMax, Y_PAD_FACTOR);

  const workerY = workerData.map((d) => d.y);
  const { yMin: workerYMin, yMax: workerYMax } = computeYExtent(
    workerY,
    [0],
    [1],
  );
  const workerYPad = padYDomain(workerYMin, workerYMax, Y_PAD_FACTOR);

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
    workerYMin,
    workerYMax,
    workerYPad,
  };
}
