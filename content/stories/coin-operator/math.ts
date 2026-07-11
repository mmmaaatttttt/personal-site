import { generateFreqMap } from "@/utils/arrayHelpers";
import { PAYOUT_RATES, type SlotResult, SlotValue } from "./data";

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

export function calculateProbability(_slotResult: SlotResult): number {
  return 0;
}
