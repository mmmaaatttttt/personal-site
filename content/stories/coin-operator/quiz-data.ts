import { type SlotResult, SlotValue } from "./data";

/** Scenarios for the bonus-spin strategy quiz. Every entry is a distinct
 *  symbol multiset; ordered roughly easy → hard for display, though the
 *  correct answer and its EV are always computed live via bonusMath, never
 *  hardcoded here. */
export const quizScenarios: SlotResult[] = [
  [SlotValue.DASH, SlotValue.DASH, SlotValue.DASH, SlotValue.DASH],
  [SlotValue.CROWN, SlotValue.CROWN, SlotValue.CROWN, SlotValue.DASH],
  [SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.DASH, SlotValue.DASH],
  [SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.DASH, SlotValue.DOUBLE],
  [SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_3, SlotValue.COIN_3],
  [SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.DASH],
  [SlotValue.SNAKE, SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.CROWN],
  [SlotValue.CLOVER, SlotValue.SNAKE, SlotValue.DASH, SlotValue.COIN_1],
  [SlotValue.SNAKE, SlotValue.NET, SlotValue.COIN_1, SlotValue.COIN_1],
  [SlotValue.SNAKE, SlotValue.SNAKE, SlotValue.SNAKE, SlotValue.CROWN],
];

/** The quiz asks about the EV of taking exactly one bonus spin right now —
 *  not the full multi-spin optimal-continuation value used elsewhere in the
 *  article, which is why this is 1, not the article's 3-spin rule. */
export const QUIZ_SPINS_REMAINING = 1;
