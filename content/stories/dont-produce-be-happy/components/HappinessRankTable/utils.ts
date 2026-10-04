import type { UsHappinessYear } from "../../data";

export interface RankDeltaRow extends UsHappinessYear {
  rankDelta: number | null;
}

export function computeRankDeltas(rows: UsHappinessYear[]): RankDeltaRow[] {
  return rows.map((row, index) => {
    if (index === 0) return { ...row, rankDelta: null };
    const previousRank = rows[index - 1].rank;
    return { ...row, rankDelta: previousRank - row.rank };
  });
}
