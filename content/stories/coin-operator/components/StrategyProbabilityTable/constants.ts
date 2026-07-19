import type { SliderInitialData } from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import { type SlotResult, SlotValue, SYMBOL_EMOJI } from "../../data";
import { SLIDER_CONFIG as OPTIMALITY_SLIDER_CONFIG } from "../BonusSpinEvChart/constants";

/** Two single-coin, two 3-coin symbols — the worked example used throughout
 *  the bounded-rationality discussion. */
export const EXAMPLE_STATE: SlotResult = [
  SlotValue.COIN_1,
  SlotValue.COIN_1,
  SlotValue.COIN_3,
  SlotValue.COIN_3,
];

export const DEFAULT_SPINS_REMAINING = 5;

const SPINS_SLIDER_CONFIG: SliderInitialData = {
  initialValue: DEFAULT_SPINS_REMAINING,
  min: 1,
  max: 10,
  step: 1,
  title: (val: number) => `TBD: ${val}`,
  color: COLORS.ORANGE,
};

/** Combines the shared optimality slider (synced with BonusSpinEvChart) and
 *  this component's own bonus-spins-count slider. Defined once at module
 *  load so `useSliders` sees a referentially stable array across renders. */
export const SLIDER_CONFIGS: SliderInitialData[] = [
  ...OPTIMALITY_SLIDER_CONFIG,
  SPINS_SLIDER_CONFIG,
];

/** Fixed row order: "stay" first, then the two respin actions present in
 *  `EXAMPLE_STATE`. Keeping this order explicit (rather than deriving it
 *  from `Object.keys`) keeps row order stable regardless of iteration order. */
export const ROWS: { key: "stay" | SlotValue; label: string }[] = [
  { key: "stay", label: "Stay" },
  { key: SlotValue.COIN_1, label: `Spin ${SYMBOL_EMOJI[SlotValue.COIN_1]}` },
  { key: SlotValue.COIN_3, label: `Spin ${SYMBOL_EMOJI[SlotValue.COIN_3]}` },
];

export const COLUMN_HEADERS = [
  "No strategy (random)",
  "Unoptimized strategy",
  "Optimized strategy",
];
