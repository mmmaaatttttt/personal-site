import {
  alphaCO,
  alphaNE,
  linspace,
  ownerProfitChange,
} from "../../../dailemma/math";
import {
  coalitionAutomationRate,
  computeYExtent,
  padYDomain,
} from "../../math";

const ALPHA_RANGE = linspace(0, 1, 100);
const Y_PAD_FACTOR = 0.08;

export interface CoalitionData {
  ownerData: { x: number; y: number }[];
  coordinatedOutcome: number;
  marketOutcome: number;
  coalitionOutcome: number;
  coOwnerProfit: number;
  neOwnerProfit: number;
  coalitionOwnerProfit: number;
  yMin: number;
  yMax: number;
  yPad: number;
}

export function useCoalitionData(
  savings: number,
  demandLoss: number,
  numFirms: number,
  difficulty: number,
  coalitionSize: number,
): CoalitionData {
  const ownerData = ALPHA_RANGE.map((a) => ({
    x: a,
    y: ownerProfitChange(a, savings, demandLoss, difficulty),
  }));

  const coordinatedOutcome = alphaCO(savings, demandLoss, difficulty);
  const marketOutcome = alphaNE(savings, demandLoss, numFirms, difficulty);
  const coalitionOutcome = coalitionAutomationRate(
    savings,
    demandLoss,
    numFirms,
    difficulty,
    coalitionSize,
  );

  const coOwnerProfit = ownerProfitChange(
    coordinatedOutcome,
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
  const coalitionOwnerProfit = ownerProfitChange(
    coalitionOutcome,
    savings,
    demandLoss,
    difficulty,
  );

  const ownerY = ownerData.map((d) => d.y);
  const { yMin, yMax } = computeYExtent(ownerY, [0], [0]);
  const yPad = padYDomain(yMin, yMax, Y_PAD_FACTOR);

  return {
    ownerData,
    coordinatedOutcome,
    marketOutcome,
    coalitionOutcome,
    coOwnerProfit,
    neOwnerProfit,
    coalitionOwnerProfit,
    yMin,
    yMax,
    yPad,
  };
}
