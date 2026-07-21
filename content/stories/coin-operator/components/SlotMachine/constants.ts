import COLORS from "@/utils/styles";

/** Base key for round history in localStorage. Each `SlotMachine` instance
 *  suffixes this with its `maxBonusSpins` prop so, e.g., the no-bonus demo
 *  and the three-bonus-spin demo track independent history. */
export const HISTORY_STORAGE_KEY = "coinOperator:history";

/** Each reel locks in `STAGGER` seconds after the previous one, so they stop
 *  left to right instead of all at once. */
export const BASE_SPIN_DURATION = 0.6;
export const REEL_STAGGER = 0.35;

/** Cumulative [cost, revenue] through a given round. Round number is the
 *  entry's position in the array (index + 1); profit is revenue - cost —
 *  both are cheap to derive, so we don't persist them redundantly. */
export type RoundEntry = [cost: number, revenue: number];

export type SeriesKey = "revenue" | "cost" | "profit";

export interface SeriesOption {
  value: SeriesKey;
  label: string;
  color: string;
  accessor: (entry: RoundEntry) => number;
}

export const SERIES_OPTIONS: SeriesOption[] = [
  {
    value: "revenue",
    label: "Revenue",
    color: COLORS.GREEN,
    accessor: ([, revenue]) => revenue,
  },
  {
    value: "cost",
    label: "Cost",
    color: COLORS.RED,
    accessor: ([cost]) => cost,
  },
  {
    value: "profit",
    label: "Profit",
    color: COLORS.BLUE,
    accessor: ([cost, revenue]) => revenue - cost,
  },
];
