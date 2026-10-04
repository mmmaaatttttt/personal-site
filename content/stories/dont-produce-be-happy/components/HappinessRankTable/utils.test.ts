import { describe, expect, it } from "vitest";
import type { UsHappinessYear } from "../../data";
import { computeRankDeltas } from "./utils";

const rows = [
  { year: 2014, rank: 15, score: 7.119 },
  { year: 2015, rank: 13, score: 7.104 },
  { year: 2016, rank: 14, score: 6.993 },
] as unknown as UsHappinessYear[];

describe("computeRankDeltas", () => {
  it("gives the first row a null delta, since there's nothing to compare it to", () => {
    const result = computeRankDeltas(rows);
    expect(result[0].rankDelta).toBeNull();
  });

  it("computes a positive delta when rank improves (a lower rank number)", () => {
    const result = computeRankDeltas(rows);
    expect(result[1].rankDelta).toBe(2);
  });

  it("computes a negative delta when rank worsens (a higher rank number)", () => {
    const result = computeRankDeltas(rows);
    expect(result[2].rankDelta).toBe(-1);
  });

  it("computes zero when rank is unchanged", () => {
    const unchanged = [
      { year: 2014, rank: 15, score: 7.1 },
      { year: 2015, rank: 15, score: 7.0 },
    ] as unknown as UsHappinessYear[];
    expect(computeRankDeltas(unchanged)[1].rankDelta).toBe(0);
  });

  it("preserves the original year/rank/score fields", () => {
    const result = computeRankDeltas(rows);
    expect(result[1]).toMatchObject({
      year: 2015,
      rank: 13,
      score: 7.104,
    });
  });
});
