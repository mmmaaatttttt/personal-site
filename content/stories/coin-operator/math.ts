import { generateFreqMap } from "@/utils/arrayHelpers";
import { combinations, cryptoRandom } from "@/utils/mathHelpers";
import {
  NUM_SLOTS,
  PAYOUT_RATES,
  PayoutClassifications,
  type PayoutClassificationValue,
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

export function classifyPayout(
  slotResult: SlotResult,
): PayoutClassificationValue | null {
  const slotFrequencies = generateFreqMap(slotResult);

  const coin1Count = slotFrequencies.get(SlotValue.COIN_1) || 0;
  const coin3Count = slotFrequencies.get(SlotValue.COIN_3) || 0;
  const doubleCount = slotFrequencies.get(SlotValue.DOUBLE) || 0;
  const cloverCount = slotFrequencies.get(SlotValue.CLOVER) || 0;
  const snakeCount = slotFrequencies.get(SlotValue.SNAKE) || 0;
  const netCount = slotFrequencies.get(SlotValue.NET) || 0;
  const crownCount = slotFrequencies.get(SlotValue.CROWN) || 0;

  if (coin1Count === 4) return PayoutClassifications.COIN_1_4;
  if (coin3Count === 4) return PayoutClassifications.COIN_3_4;
  if (crownCount === 4) return PayoutClassifications.CROWN_4;
  if (cloverCount === 4) return PayoutClassifications.CLOVER_4;

  if (coin1Count === NUM_SLOTS - 1) {
    if (doubleCount === 1) return PayoutClassifications.COIN_1_3_DOUBLE_1;
    if (cloverCount === 1) return PayoutClassifications.COIN_1_3_CLOVER_1;
    if (snakeCount === 0) return PayoutClassifications.COIN_1_3;
  }

  if (coin3Count === NUM_SLOTS - 1) {
    if (doubleCount === 1) return PayoutClassifications.COIN_3_3_DOUBLE_1;
    if (cloverCount === 1) return PayoutClassifications.COIN_3_3_CLOVER_1;
    if (snakeCount === 0) return PayoutClassifications.COIN_3_3;
  }

  // Snake requires a net or the hand is dead — grouping by snake count
  // keeps each count's own remaining-slot budget self-contained instead of
  // interleaving cases from different snake counts in one flat check list.
  if (snakeCount > 0 && netCount > 0) {
    if (snakeCount === 3) return PayoutClassifications.SNAKE_3_NET;

    if (snakeCount === 2) {
      if (doubleCount === 1) return PayoutClassifications.SNAKE_2_DOUBLE_1_NET;
      if (cloverCount === 1) return PayoutClassifications.SNAKE_2_CLOVER_1_NET;
      return PayoutClassifications.SNAKE_2_NET;
    }

    // snakeCount === 1, two slots left over for net/double/clover/filler
    if (doubleCount === 2) return PayoutClassifications.SNAKE_1_DOUBLE_2_NET;
    if (cloverCount === 2) return PayoutClassifications.SNAKE_1_CLOVER_2_NET;
    if (doubleCount === 1 && cloverCount === 1) {
      return PayoutClassifications.SNAKE_1_CLOVER_1_DOUBLE_1_NET;
    }
    if (doubleCount === 1) return PayoutClassifications.SNAKE_1_DOUBLE_1_NET;
    if (cloverCount === 1) return PayoutClassifications.SNAKE_1_CLOVER_1_NET;
    return PayoutClassifications.SNAKE_1_NET;
  }

  // Same idea for clover-only hands: grouped by clover count so each
  // count's double-count sub-cases are self-contained.
  if (cloverCount > 0 && snakeCount === 0) {
    if (cloverCount === 3) {
      if (doubleCount === 1) return PayoutClassifications.CLOVER_3_DOUBLE_1;
      return PayoutClassifications.CLOVER_3;
    }

    if (cloverCount === 2) {
      if (doubleCount === 2) return PayoutClassifications.CLOVER_2_DOUBLE_2;
      if (doubleCount === 1) return PayoutClassifications.CLOVER_2_DOUBLE_1;
      return PayoutClassifications.CLOVER_2;
    }

    // cloverCount === 1, up to three slots left over for double/filler
    if (doubleCount === 3) return PayoutClassifications.CLOVER_1_DOUBLE_3;
    if (doubleCount === 2) return PayoutClassifications.CLOVER_1_DOUBLE_2;
    if (doubleCount === 1) return PayoutClassifications.CLOVER_1_DOUBLE_1;
    return PayoutClassifications.CLOVER_1;
  }

  return null;
}

export function pickWeightedSymbol(
  rng: () => number = cryptoRandom,
): SlotValue {
  const symbols = Object.values(SlotValue) as SlotValue[];
  const roll = rng();

  let cumulative = 0;
  for (let i = 0; i < symbols.length - 1; i++) {
    cumulative += PROBABILITY_MAP[symbols[i]];
    if (roll < cumulative) return symbols[i];
  }

  return symbols[symbols.length - 1];
}

export function spinReels(rng: () => number = cryptoRandom): SlotResult {
  return Array.from({ length: NUM_SLOTS }, () =>
    pickWeightedSymbol(rng),
  ) as SlotResult;
}

export function enumerateSlotResults(): SlotResult[] {
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

  recurse(NUM_SLOTS, 0, []);
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
