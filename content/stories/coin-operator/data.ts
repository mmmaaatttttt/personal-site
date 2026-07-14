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

export const NUM_SLOTS = 4;
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

export const SYMBOL_EMOJI: Record<SlotValue, string> = {
  [SlotValue.CLOVER]: "🍀",
  [SlotValue.COIN_1]: "🟡",
  [SlotValue.COIN_3]: "💰",
  [SlotValue.CROWN]: "👑",
  [SlotValue.DASH]: "➖",
  [SlotValue.DOUBLE]: "2️⃣",
  [SlotValue.NET]: "🥅",
  [SlotValue.SNAKE]: "🐍",
};

export const SYMBOL_NAME: Record<SlotValue, string> = {
  [SlotValue.CLOVER]: "Clover",
  [SlotValue.COIN_1]: "Coin",
  [SlotValue.COIN_3]: "3 Coins",
  [SlotValue.CROWN]: "Crown",
  [SlotValue.DASH]: "Dash",
  [SlotValue.DOUBLE]: "Double",
  [SlotValue.NET]: "Net",
  [SlotValue.SNAKE]: "Snake",
};

export const PayoutClassifications = {
  COIN_1_3: SYMBOL_EMOJI[SlotValue.COIN_1].repeat(3),
  COIN_1_4: SYMBOL_EMOJI[SlotValue.COIN_1].repeat(4),
  COIN_1_3_DOUBLE_1:
    SYMBOL_EMOJI[SlotValue.COIN_1].repeat(3) + SYMBOL_EMOJI[SlotValue.DOUBLE],
  COIN_3_3: SYMBOL_EMOJI[SlotValue.COIN_3].repeat(3),
  COIN_3_4: SYMBOL_EMOJI[SlotValue.COIN_3].repeat(4),
  COIN_3_3_DOUBLE_1:
    SYMBOL_EMOJI[SlotValue.COIN_3].repeat(3) + SYMBOL_EMOJI[SlotValue.DOUBLE],
  SNAKE_1_NET: SYMBOL_EMOJI[SlotValue.SNAKE] + SYMBOL_EMOJI[SlotValue.NET],
  SNAKE_2_NET:
    SYMBOL_EMOJI[SlotValue.SNAKE].repeat(2) + SYMBOL_EMOJI[SlotValue.NET],
  SNAKE_3_NET:
    SYMBOL_EMOJI[SlotValue.SNAKE].repeat(3) + SYMBOL_EMOJI[SlotValue.NET],
  SNAKE_1_DOUBLE_1_NET:
    SYMBOL_EMOJI[SlotValue.SNAKE] +
    SYMBOL_EMOJI[SlotValue.DOUBLE] +
    SYMBOL_EMOJI[SlotValue.NET],
  SNAKE_1_DOUBLE_2_NET:
    SYMBOL_EMOJI[SlotValue.SNAKE] +
    SYMBOL_EMOJI[SlotValue.DOUBLE].repeat(2) +
    SYMBOL_EMOJI[SlotValue.NET],
  SNAKE_2_DOUBLE_1_NET:
    SYMBOL_EMOJI[SlotValue.SNAKE].repeat(2) +
    SYMBOL_EMOJI[SlotValue.DOUBLE] +
    SYMBOL_EMOJI[SlotValue.NET],
  CROWN_4: SYMBOL_EMOJI[SlotValue.CROWN].repeat(4),
  COIN_1_3_CLOVER_1:
    SYMBOL_EMOJI[SlotValue.COIN_1].repeat(3) + SYMBOL_EMOJI[SlotValue.CLOVER],
  COIN_3_3_CLOVER_1:
    SYMBOL_EMOJI[SlotValue.COIN_3].repeat(3) + SYMBOL_EMOJI[SlotValue.CLOVER],
  SNAKE_1_CLOVER_1_NET:
    SYMBOL_EMOJI[SlotValue.SNAKE] +
    SYMBOL_EMOJI[SlotValue.CLOVER] +
    SYMBOL_EMOJI[SlotValue.NET],
  SNAKE_1_CLOVER_2_NET:
    SYMBOL_EMOJI[SlotValue.SNAKE] +
    SYMBOL_EMOJI[SlotValue.CLOVER].repeat(2) +
    SYMBOL_EMOJI[SlotValue.NET],
  SNAKE_2_CLOVER_1_NET:
    SYMBOL_EMOJI[SlotValue.SNAKE].repeat(2) +
    SYMBOL_EMOJI[SlotValue.CLOVER] +
    SYMBOL_EMOJI[SlotValue.NET],
  SNAKE_1_CLOVER_1_DOUBLE_1_NET:
    SYMBOL_EMOJI[SlotValue.SNAKE] +
    SYMBOL_EMOJI[SlotValue.CLOVER] +
    SYMBOL_EMOJI[SlotValue.DOUBLE] +
    SYMBOL_EMOJI[SlotValue.NET],
  CLOVER_1: SYMBOL_EMOJI[SlotValue.CLOVER],
  CLOVER_2: SYMBOL_EMOJI[SlotValue.CLOVER].repeat(2),
  CLOVER_3: SYMBOL_EMOJI[SlotValue.CLOVER].repeat(3),
  CLOVER_4: SYMBOL_EMOJI[SlotValue.CLOVER].repeat(4),
  CLOVER_1_DOUBLE_1:
    SYMBOL_EMOJI[SlotValue.CLOVER] + SYMBOL_EMOJI[SlotValue.DOUBLE],
  CLOVER_1_DOUBLE_2:
    SYMBOL_EMOJI[SlotValue.CLOVER] + SYMBOL_EMOJI[SlotValue.DOUBLE].repeat(2),
  CLOVER_1_DOUBLE_3:
    SYMBOL_EMOJI[SlotValue.CLOVER] + SYMBOL_EMOJI[SlotValue.DOUBLE].repeat(3),
  CLOVER_2_DOUBLE_1:
    SYMBOL_EMOJI[SlotValue.CLOVER].repeat(2) + SYMBOL_EMOJI[SlotValue.DOUBLE],
  CLOVER_2_DOUBLE_2:
    SYMBOL_EMOJI[SlotValue.CLOVER].repeat(2) +
    SYMBOL_EMOJI[SlotValue.DOUBLE].repeat(2),
  CLOVER_3_DOUBLE_1:
    SYMBOL_EMOJI[SlotValue.CLOVER].repeat(3) + SYMBOL_EMOJI[SlotValue.DOUBLE],
} as const;

export type PayoutClassificationValue =
  (typeof PayoutClassifications)[keyof typeof PayoutClassifications];
