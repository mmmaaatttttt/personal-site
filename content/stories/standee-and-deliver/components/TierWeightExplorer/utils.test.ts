import { describe, expect, it } from "vitest";
import { harmonicNumber } from "../../utils";
import {
  countStandeesByTier,
  expectedWeightedRandomDrawsByCount,
  findMinimumPoint,
  hasUniformOdds,
  tierCountsForCollectionSize,
} from "./utils";

// Mirrors the real game's per-character pose cycle.
const POSE_CYCLE = [
  "Jumping",
  "Swimming",
  "Elephant",
  "Bubble",
  "Hoppycat",
  "Goomba",
  "Crouching",
  "Posing",
  "Fire",
  "Drill",
  "Balloon",
  "Spike Ball",
];

describe("countStandeesByTier", () => {
  it("buckets each pose into its tier", () => {
    const counts = countStandeesByTier([
      "Jumping",
      "Posing",
      "Elephant",
      "Balloon",
    ]);
    expect(counts).toEqual({ black: 2, silver: 1, gold: 1 });
  });

  it("returns all zeros for an empty list", () => {
    expect(countStandeesByTier([])).toEqual({ black: 0, silver: 0, gold: 0 });
  });
});

describe("expectedWeightedRandomDrawsByCount", () => {
  it("matches the classic 3-item coupon collector by hand", () => {
    const draws = expectedWeightedRandomDrawsByCount(
      { black: 1, silver: 1, gold: 1 },
      { black: 1 / 3, silver: 1 / 3, gold: 1 / 3 },
    );
    expect(draws[0]).toBe(0);
    expect(draws[1]).toBeCloseTo(1);
    expect(draws[2]).toBeCloseTo(2.5);
    expect(draws[3]).toBeCloseTo(5.5);
  });

  it("matches the uniform closed form when tier weights split evenly", () => {
    const nPerTier = 10;
    const draws = expectedWeightedRandomDrawsByCount(
      { black: nPerTier, silver: nPerTier, gold: nPerTier },
      { black: 1 / 3, silver: 1 / 3, gold: 1 / 3 },
    );
    const total = nPerTier * 3;
    for (const k of [0, 5, 15, 25, total]) {
      const closedForm =
        total * (harmonicNumber(total) - harmonicNumber(total - k));
      expect(draws[k]).toBeCloseTo(closedForm, 6);
    }
  });

  it("is monotonically increasing in the number of items collected", () => {
    const draws = expectedWeightedRandomDrawsByCount(
      { black: 5, silver: 3, gold: 2 },
      { black: 0.5, silver: 0.3, gold: 0.2 },
    );
    for (let i = 1; i < draws.length; i++) {
      expect(draws[i]).toBeGreaterThan(draws[i - 1]);
    }
  });

  it("goes to infinity once collection requires a zero-weight tier", () => {
    const draws = expectedWeightedRandomDrawsByCount(
      { black: 2, silver: 2, gold: 2 },
      { black: 0.5, silver: 0.5, gold: 0 },
    );
    expect(Number.isFinite(draws[4])).toBe(true);
    expect(draws[5]).toBe(Number.POSITIVE_INFINITY);
    expect(draws[6]).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("findMinimumPoint", () => {
  it("returns the point with the lowest y value", () => {
    const point = findMinimumPoint([
      { x: 0, y: 10 },
      { x: 1, y: 3 },
      { x: 2, y: 7 },
    ]);
    expect(point).toEqual({ x: 1, y: 3 });
  });

  it("returns the sole point in a single-element array", () => {
    const point = findMinimumPoint([{ x: 5, y: 42 }]);
    expect(point).toEqual({ x: 5, y: 42 });
  });
});

describe("tierCountsForCollectionSize", () => {
  it("returns all zeros for an empty collection", () => {
    expect(tierCountsForCollectionSize(0, POSE_CYCLE)).toEqual({
      black: 0,
      silver: 0,
      gold: 0,
    });
  });

  it("excludes the starter pose for a single full character", () => {
    expect(tierCountsForCollectionSize(11, POSE_CYCLE)).toEqual({
      black: 3,
      silver: 4,
      gold: 4,
    });
  });

  it("scales linearly across multiple full characters", () => {
    expect(tierCountsForCollectionSize(22, POSE_CYCLE)).toEqual({
      black: 6,
      silver: 8,
      gold: 8,
    });
  });

  it("handles a partial character by walking the cycle in order", () => {
    expect(tierCountsForCollectionSize(5, POSE_CYCLE)).toEqual({
      black: 1,
      silver: 2,
      gold: 2,
    });
  });
});

describe("hasUniformOdds", () => {
  it("is true when weights split evenly and tier counts match", () => {
    expect(
      hasUniformOdds(
        { black: 48, silver: 48, gold: 48 },
        { black: 1 / 3, silver: 1 / 3, gold: 1 / 3 },
      ),
    ).toBe(true);
  });

  it("is true when uneven weights exactly offset uneven tier counts", () => {
    expect(
      hasUniformOdds(
        { black: 40, silver: 20, gold: 20 },
        { black: 0.5, silver: 0.25, gold: 0.25 },
      ),
    ).toBe(true);
  });

  it("is false when a tier's per-item probability differs from the rest", () => {
    expect(
      hasUniformOdds(
        { black: 48, silver: 48, gold: 48 },
        { black: 0.5, silver: 0.3, gold: 0.2 },
      ),
    ).toBe(false);
  });
});
