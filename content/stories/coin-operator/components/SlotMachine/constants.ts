import COLORS from "@/utils/styles";

/** Cost of a standard spin. Bonus per-reel re-spins (future extension) add to
 *  this on a per-round basis rather than replacing it. */
export const SPIN_COST = 1;

export const HISTORY_STORAGE_KEY = "coinOperator:history";

/** Each reel locks in `STAGGER` seconds after the previous one, so they stop
 *  left to right instead of all at once. */
export const BASE_SPIN_DURATION = 0.6;
export const REEL_STAGGER = 0.35;

export interface RoundRecord {
  round: number;
  revenue: number;
  cost: number;
  profit: number;
}

export type SeriesKey = Exclude<keyof RoundRecord, "round">;

export interface SeriesOption {
  value: SeriesKey;
  label: string;
  color: string;
}

export const SERIES_OPTIONS: SeriesOption[] = [
  { value: "revenue", label: "Revenue", color: COLORS.GREEN },
  { value: "cost", label: "Cost", color: COLORS.RED },
  { value: "profit", label: "Profit", color: COLORS.BLUE },
];
