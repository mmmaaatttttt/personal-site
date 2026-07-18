import { type SlotResult, SlotValue } from "../../data";

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

/** Player picks how many bonus spins are available for the round. Whichever
 *  mode is selected, `optimalStrategy(scenario, mode)` is the same fully
 *  recursive value the article uses elsewhere for the overall machine EV —
 *  just evaluated at one specific board instead of averaged across all 330.
 *  That recursion is exactly why the best first move can differ by mode. */
export const QUIZ_SPIN_MODES = [1, 3, 5] as const;
export type QuizSpinMode = (typeof QUIZ_SPIN_MODES)[number];
export const DEFAULT_QUIZ_SPIN_MODE: QuizSpinMode = QUIZ_SPIN_MODES[0];
