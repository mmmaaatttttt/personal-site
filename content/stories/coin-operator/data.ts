export enum SlotValue {
  CLOVER = "CLOVER",
  COIN_1 = "COIN_1",
  COIN_3 = "COIN_3",
  CROWN = "CROWN",
  DASH = "DASH",
  DOUBLE = "DOUBLE",
  NET = "NET",
  SNAKE = "SNAKE",
}

export type SlotResult = [SlotValue, SlotValue, SlotValue, SlotValue];

export const PAYOUT_RATES: Record<string, number> = {
  CLOVER: 10,
  COINS_PER_SNAKE: 3,
  COIN_1_THREE: 3,
  COIN_1_FOUR: 5,
  COIN_3_THREE: 9,
  COIN_3_FOUR: 15,
  CROWN_JACKPOT: 100,
} as const;

export const PROBABILITY_MAP: Record<SlotValue, number> = {
  [SlotValue.CLOVER]: 0.005,
  [SlotValue.COIN_1]: 0.315,
  [SlotValue.COIN_3]: 0.09,
  [SlotValue.CROWN]: 0.08,
  [SlotValue.DASH]: 0.28,
  [SlotValue.DOUBLE]: 0.09,
  [SlotValue.NET]: 0.04,
  [SlotValue.SNAKE]: 0.1,
} as const;
