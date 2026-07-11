import { generateFreqMap } from "@/utils/arrayHelpers";
import { combinations } from "@/utils/mathHelpers";
import {
  PAYOUT_RATES,
  PROBABILITY_MAP,
  type SlotResult,
  SlotValue,
} from "./data";

export function calculatePayout(slotResult: SlotResult): number {
  const slotFrequencies = generateFreqMap(slotResult);
  const slotKeys = Array.from(slotFrequencies.keys());

  if (slotKeys.length === 1) {
    const uniqueKey = slotKeys[0];

    if (uniqueKey === SlotValue.COIN_1) return PAYOUT_RATES.COIN_1_FOUR;
    if (uniqueKey === SlotValue.COIN_3) return PAYOUT_RATES.COIN_3_FOUR;
    if (uniqueKey === SlotValue.CROWN) return PAYOUT_RATES.CROWN_JACKPOT;
  }

  if (slotKeys.includes(SlotValue.SNAKE) && !slotKeys.includes(SlotValue.NET)) {
    return 0;
  }

  let payout = 0;
  const multiplier = 2 ** (slotFrequencies.get(SlotValue.DOUBLE) || 0);

  if (slotFrequencies.get(SlotValue.COIN_1) === 3) {
    payout += PAYOUT_RATES.COIN_1_THREE;
  }
  if (slotFrequencies.get(SlotValue.COIN_3) === 3) {
    payout += PAYOUT_RATES.COIN_3_THREE;
  }

  // if we get here and we have snakes, we are guaranteed to have at least one net
  payout +=
    (slotFrequencies.get(SlotValue.SNAKE) || 0) * PAYOUT_RATES.COINS_PER_SNAKE;

  payout += (slotFrequencies.get(SlotValue.CLOVER) || 0) * PAYOUT_RATES.CLOVER;

  return payout * multiplier;
}

export function enumerateMultisets(): SlotResult[] {
  const symbols = Object.values(SlotValue) as SlotValue[];
  const results: SlotResult[] = [];

  function recurse(
    slotsRemaining: number,
    minIndex: number,
    current: SlotValue[],
  ) {
    if (slotsRemaining === 0) {
      results.push(current as SlotResult);
      return;
    }
    for (let i = minIndex; i < symbols.length; i++) {
      recurse(slotsRemaining - 1, i, [...current, symbols[i]]);
    }
  }

  recurse(4, 0, []);
  return results;
}

export function calculateProbability(slotResult: SlotResult): number {
  const freqMap = generateFreqMap(slotResult);

  let coefficient = 1;
  let remaining = slotResult.length;
  for (const count of freqMap.values()) {
    coefficient *= combinations(remaining, count);
    remaining -= count;
  }

  let probability = coefficient;
  for (const [symbol, count] of freqMap.entries()) {
    probability *= PROBABILITY_MAP[symbol] ** count;
  }

  return probability;
}
