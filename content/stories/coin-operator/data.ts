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

// Joining whole emoji with a separator here (rather than gluing them into one
// string and trying to split it apart later) sidesteps a real gotcha: some
// emoji, like the double-symbol keycap, are multiple UTF-16 code units
// glued together, so splitting an already-built string by character can
// tear a single emoji apart.
function emojiSequence(...symbols: SlotValue[]): string {
  return symbols.map((symbol) => SYMBOL_EMOJI[symbol]).join(" ");
}

export const PayoutClassifications = {
  COIN_1_3: emojiSequence(SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_1),
  COIN_1_4: emojiSequence(
    SlotValue.COIN_1,
    SlotValue.COIN_1,
    SlotValue.COIN_1,
    SlotValue.COIN_1,
  ),
  COIN_1_3_DOUBLE_1: emojiSequence(
    SlotValue.COIN_1,
    SlotValue.COIN_1,
    SlotValue.COIN_1,
    SlotValue.DOUBLE,
  ),
  COIN_3_3: emojiSequence(SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.COIN_3),
  COIN_3_4: emojiSequence(
    SlotValue.COIN_3,
    SlotValue.COIN_3,
    SlotValue.COIN_3,
    SlotValue.COIN_3,
  ),
  COIN_3_3_DOUBLE_1: emojiSequence(
    SlotValue.COIN_3,
    SlotValue.COIN_3,
    SlotValue.COIN_3,
    SlotValue.DOUBLE,
  ),
  SNAKE_1_NET: emojiSequence(SlotValue.SNAKE, SlotValue.NET),
  SNAKE_2_NET: emojiSequence(SlotValue.SNAKE, SlotValue.SNAKE, SlotValue.NET),
  SNAKE_3_NET: emojiSequence(
    SlotValue.SNAKE,
    SlotValue.SNAKE,
    SlotValue.SNAKE,
    SlotValue.NET,
  ),
  SNAKE_1_DOUBLE_1_NET: emojiSequence(
    SlotValue.SNAKE,
    SlotValue.DOUBLE,
    SlotValue.NET,
  ),
  SNAKE_1_DOUBLE_2_NET: emojiSequence(
    SlotValue.SNAKE,
    SlotValue.DOUBLE,
    SlotValue.DOUBLE,
    SlotValue.NET,
  ),
  SNAKE_2_DOUBLE_1_NET: emojiSequence(
    SlotValue.SNAKE,
    SlotValue.SNAKE,
    SlotValue.DOUBLE,
    SlotValue.NET,
  ),
  CROWN_4: emojiSequence(
    SlotValue.CROWN,
    SlotValue.CROWN,
    SlotValue.CROWN,
    SlotValue.CROWN,
  ),
  COIN_1_3_CLOVER_1: emojiSequence(
    SlotValue.COIN_1,
    SlotValue.COIN_1,
    SlotValue.COIN_1,
    SlotValue.CLOVER,
  ),
  COIN_3_3_CLOVER_1: emojiSequence(
    SlotValue.COIN_3,
    SlotValue.COIN_3,
    SlotValue.COIN_3,
    SlotValue.CLOVER,
  ),
  SNAKE_1_CLOVER_1_NET: emojiSequence(
    SlotValue.SNAKE,
    SlotValue.CLOVER,
    SlotValue.NET,
  ),
  SNAKE_1_CLOVER_2_NET: emojiSequence(
    SlotValue.SNAKE,
    SlotValue.CLOVER,
    SlotValue.CLOVER,
    SlotValue.NET,
  ),
  SNAKE_2_CLOVER_1_NET: emojiSequence(
    SlotValue.SNAKE,
    SlotValue.SNAKE,
    SlotValue.CLOVER,
    SlotValue.NET,
  ),
  SNAKE_1_CLOVER_1_DOUBLE_1_NET: emojiSequence(
    SlotValue.SNAKE,
    SlotValue.CLOVER,
    SlotValue.DOUBLE,
    SlotValue.NET,
  ),
  CLOVER_1: emojiSequence(SlotValue.CLOVER),
  CLOVER_2: emojiSequence(SlotValue.CLOVER, SlotValue.CLOVER),
  CLOVER_3: emojiSequence(SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.CLOVER),
  CLOVER_4: emojiSequence(
    SlotValue.CLOVER,
    SlotValue.CLOVER,
    SlotValue.CLOVER,
    SlotValue.CLOVER,
  ),
  CLOVER_1_DOUBLE_1: emojiSequence(SlotValue.CLOVER, SlotValue.DOUBLE),
  CLOVER_1_DOUBLE_2: emojiSequence(
    SlotValue.CLOVER,
    SlotValue.DOUBLE,
    SlotValue.DOUBLE,
  ),
  CLOVER_1_DOUBLE_3: emojiSequence(
    SlotValue.CLOVER,
    SlotValue.DOUBLE,
    SlotValue.DOUBLE,
    SlotValue.DOUBLE,
  ),
  CLOVER_2_DOUBLE_1: emojiSequence(
    SlotValue.CLOVER,
    SlotValue.CLOVER,
    SlotValue.DOUBLE,
  ),
  CLOVER_2_DOUBLE_2: emojiSequence(
    SlotValue.CLOVER,
    SlotValue.CLOVER,
    SlotValue.DOUBLE,
    SlotValue.DOUBLE,
  ),
  CLOVER_3_DOUBLE_1: emojiSequence(
    SlotValue.CLOVER,
    SlotValue.CLOVER,
    SlotValue.CLOVER,
    SlotValue.DOUBLE,
  ),
} as const;

export type PayoutClassificationValue =
  (typeof PayoutClassifications)[keyof typeof PayoutClassifications];
