import {
  alphaCO,
  linspace,
  ownerProfitChange,
  workerIncome,
} from "../../../dailemma/math";
import { nashRateWithAutomationTax, optimalAutomationTax } from "../../math";

const ALPHA_RANGE = linspace(0, 1, 100);
const Y_PAD_FACTOR = 0.08;
const REPLACEMENT_RATE = 0.3;

export interface PigouvianTaxData {
  ownerData: { x: number; y: number }[];
  workerData: { x: number; y: number }[];
  coordinatedOutcome: number;
  taxedMarketOutcome: number;
  optimalTax: number;
  currentTaxRate: number;
  coOwnerProfit: number;
  coWorkerIncome: number;
  taxedNeOwnerProfit: number;
  taxedNeWorkerIncome: number;
  yMin: number;
  yMax: number;
  yPad: number;
}

export function usePigouvianTaxData(
  savings: number,
  demandLoss: number,
  numFirms: number,
  difficulty: number,
  taxFraction: number,
): PigouvianTaxData {
  const optimalTax = optimalAutomationTax(demandLoss, numFirms);
  const currentTaxRate = taxFraction * optimalTax;

  const ownerData = ALPHA_RANGE.map((a) => ({
    x: a,
    y: ownerProfitChange(a, savings, demandLoss, difficulty),
  }));
  const workerData = ALPHA_RANGE.map((a) => ({
    x: a,
    y: workerIncome(a, REPLACEMENT_RATE),
  }));

  const coordinatedOutcome = alphaCO(savings, demandLoss, difficulty);
  const taxedMarketOutcome = nashRateWithAutomationTax(
    savings,
    demandLoss,
    numFirms,
    difficulty,
    currentTaxRate,
  );

  const coOwnerProfit = ownerProfitChange(
    coordinatedOutcome,
    savings,
    demandLoss,
    difficulty,
  );
  const coWorkerIncome = workerIncome(coordinatedOutcome, REPLACEMENT_RATE);
  const taxedNeOwnerProfit = ownerProfitChange(
    taxedMarketOutcome,
    savings,
    demandLoss,
    difficulty,
  );
  const taxedNeWorkerIncome = workerIncome(
    taxedMarketOutcome,
    REPLACEMENT_RATE,
  );

  const allY = [...ownerData.map((d) => d.y), ...workerData.map((d) => d.y)];
  const yMin = Math.min(0, ...allY);
  const yMax = Math.max(1, ...allY);
  const yPad = (yMax - yMin) * Y_PAD_FACTOR;

  return {
    ownerData,
    workerData,
    coordinatedOutcome,
    taxedMarketOutcome,
    optimalTax,
    currentTaxRate,
    coOwnerProfit,
    coWorkerIncome,
    taxedNeOwnerProfit,
    taxedNeWorkerIncome,
    yMin,
    yMax,
    yPad,
  };
}
