import { tierDrawCounts, tierDrawTotal } from "../../data";

export const DEFAULT_TIER_WEIGHTS = {
  black: 3 / 11,
  silver: 4 / 11,
  gold: 4 / 11,
} as const;

export const REAL_OBSERVED_TIER_WEIGHTS = {
  black: tierDrawCounts.black / tierDrawTotal,
  silver: tierDrawCounts.silver / tierDrawTotal,
  gold: tierDrawCounts.gold / tierDrawTotal,
} as const;

export const WIDTH = 600;
export const HEIGHT = 400;
export const GRAPH_PADDING = { top: 20, bottom: 75, left: 110, right: 20 };
