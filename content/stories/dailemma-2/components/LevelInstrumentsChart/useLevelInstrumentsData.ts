import {
  alphaCO,
  alphaNE,
  linspace,
  ownerProfitChange,
} from "../../../dailemma/math";
import { computeYExtent, padYDomain } from "../../math";

const ALPHA_RANGE = linspace(0, 1, 100);
const Y_PAD_FACTOR = 0.08;

export interface LevelInstrumentsData {
  baselineData: { x: number; y: number }[];
  ubiData: { x: number; y: number }[];
  capitalTaxData: { x: number; y: number }[];
  marketOutcome: number;
  coordinatedOutcome: number;
  coBaselineProfit: number;
  neBaselineProfit: number;
  coUbiProfit: number;
  neUbiProfit: number;
  coCapitalTaxProfit: number;
  neCapitalTaxProfit: number;
  yMin: number;
  yMax: number;
  yPad: number;
}

function applyUbi(baseProfit: number, ubiBenefit: number): number {
  return baseProfit + ubiBenefit;
}

function applyCapitalTax(baseProfit: number, capitalTaxRate: number): number {
  return (1 - capitalTaxRate) * baseProfit;
}

export function useLevelInstrumentsData(
  savings: number,
  demandLoss: number,
  numFirms: number,
  difficulty: number,
  ubiBenefit: number,
  capitalTaxRate: number,
): LevelInstrumentsData {
  const baselineData = ALPHA_RANGE.map((a) => ({
    x: a,
    y: ownerProfitChange(a, savings, demandLoss, difficulty),
  }));

  const ubiData = baselineData.map((d) => ({
    x: d.x,
    y: applyUbi(d.y, ubiBenefit),
  }));

  const capitalTaxData = baselineData.map((d) => ({
    x: d.x,
    y: applyCapitalTax(d.y, capitalTaxRate),
  }));

  const marketOutcome = alphaNE(savings, demandLoss, numFirms, difficulty);
  const coordinatedOutcome = alphaCO(savings, demandLoss, difficulty);

  const coBaselineProfit = ownerProfitChange(
    coordinatedOutcome,
    savings,
    demandLoss,
    difficulty,
  );
  const neBaselineProfit = ownerProfitChange(
    marketOutcome,
    savings,
    demandLoss,
    difficulty,
  );
  const coUbiProfit = applyUbi(coBaselineProfit, ubiBenefit);
  const neUbiProfit = applyUbi(neBaselineProfit, ubiBenefit);
  const coCapitalTaxProfit = applyCapitalTax(coBaselineProfit, capitalTaxRate);
  const neCapitalTaxProfit = applyCapitalTax(neBaselineProfit, capitalTaxRate);

  const allY = [
    ...baselineData.map((d) => d.y),
    ...ubiData.map((d) => d.y),
    ...capitalTaxData.map((d) => d.y),
  ];
  const { yMin, yMax } = computeYExtent(allY, [0], [0]);
  const yPad = padYDomain(yMin, yMax, Y_PAD_FACTOR);

  return {
    baselineData,
    ubiData,
    capitalTaxData,
    marketOutcome,
    coordinatedOutcome,
    coBaselineProfit,
    neBaselineProfit,
    coUbiProfit,
    neUbiProfit,
    coCapitalTaxProfit,
    neCapitalTaxProfit,
    yMin,
    yMax,
    yPad,
  };
}
