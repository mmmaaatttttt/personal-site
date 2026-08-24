import {
  alphaCO,
  alphaNE,
  linspace,
  ownerProfitChange,
  workerIncome,
} from "../../../dailemma/math";
import {
  computeYExtent,
  nashRateWithWorkerEquity,
  padYDomain,
} from "../../math";

const ALPHA_RANGE = linspace(0, 1, 100);
const Y_PAD_FACTOR = 0.08;
const REPLACEMENT_RATE = 0.3;

export interface WorkerEquityData {
  ownerData: { x: number; y: number }[];
  workerData: { x: number; y: number }[];
  coordinatedOutcome: number;
  baselineMarketOutcome: number;
  equityMarketOutcome: number;
  coOwnerProfit: number;
  coWorkerIncome: number;
  baselineNeOwnerProfit: number;
  baselineNeWorkerIncome: number;
  equityNeOwnerProfit: number;
  equityNeWorkerIncome: number;
  yMin: number;
  yMax: number;
  yPad: number;
}

export function useWorkerEquityData(
  savings: number,
  demandLoss: number,
  numFirms: number,
  difficulty: number,
  equityShare: number,
  sectorSpendingFraction: number,
): WorkerEquityData {
  const ownerData = ALPHA_RANGE.map((a) => ({
    x: a,
    y: ownerProfitChange(a, savings, demandLoss, difficulty),
  }));
  const workerData = ALPHA_RANGE.map((a) => ({
    x: a,
    y: workerIncome(a, REPLACEMENT_RATE),
  }));

  const coordinatedOutcome = alphaCO(savings, demandLoss, difficulty);
  const baselineMarketOutcome = alphaNE(
    savings,
    demandLoss,
    numFirms,
    difficulty,
  );
  const equityMarketOutcome = nashRateWithWorkerEquity(
    savings,
    demandLoss,
    numFirms,
    difficulty,
    equityShare,
    sectorSpendingFraction,
  );

  const coOwnerProfit = ownerProfitChange(
    coordinatedOutcome,
    savings,
    demandLoss,
    difficulty,
  );
  const coWorkerIncome = workerIncome(coordinatedOutcome, REPLACEMENT_RATE);

  const baselineNeOwnerProfit = ownerProfitChange(
    baselineMarketOutcome,
    savings,
    demandLoss,
    difficulty,
  );
  const baselineNeWorkerIncome = workerIncome(
    baselineMarketOutcome,
    REPLACEMENT_RATE,
  );

  const equityNeOwnerProfit = ownerProfitChange(
    equityMarketOutcome,
    savings,
    demandLoss,
    difficulty,
  );
  const equityNeWorkerIncome = workerIncome(
    equityMarketOutcome,
    REPLACEMENT_RATE,
  );

  const { yMin: workerYMin, yMax: workerYMax } = computeYExtent(
    workerData.map((d) => d.y),
  );
  const { yMin: ownerYMin, yMax: ownerYMax } = computeYExtent(
    ownerData.map((d) => d.y),
    [0],
  );
  const yMin = Math.min(ownerYMin, workerYMin);
  const yMax = Math.max(ownerYMax, workerYMax);
  const yPad = padYDomain(yMin, yMax, Y_PAD_FACTOR);

  return {
    ownerData,
    workerData,
    coordinatedOutcome,
    baselineMarketOutcome,
    equityMarketOutcome,
    coOwnerProfit,
    coWorkerIncome,
    baselineNeOwnerProfit,
    baselineNeWorkerIncome,
    equityNeOwnerProfit,
    equityNeWorkerIncome,
    yMin,
    yMax,
    yPad,
  };
}
