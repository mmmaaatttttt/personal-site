import COLORS from "@/utils/styles";

/** Cost of a standard spin. Bonus per-reel re-spins (future extension) add to
 *  this on a per-round basis rather than replacing it. */
export const SPIN_COST = 1;

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
