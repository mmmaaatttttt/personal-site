import { describe, expect, it, vi } from "vitest";
import {
  expectedCost,
  expectedRandomDraws,
  expectedTotalDraws,
  getTier,
  harmonicNumber,
  optimalSwitchPoint,
  pickDraw,
  pickInitialOwned,
  simulateFullRun,
} from "./utils";

describe("pickDraw", () => {
  it("draws a random index when fewer standees are found than the switch threshold", () => {
    const found = [false, false, false, false];
    const draw = pickDraw(found, 4, () => 0.5);
    expect(draw).toEqual({ index: 2, strategy: "random" });
  });

  it("allows a random draw to land on an already-found standee (a duplicate)", () => {
    const found = [true, false, false];
    const draw = pickDraw(found, 3, () => 0);
    expect(draw).toEqual({ index: 0, strategy: "random" });
  });

  it("switches to a guaranteed pick of the first missing standee once the threshold is met", () => {
    const found = [true, true, false, true, false];
    const draw = pickDraw(found, 2);
    expect(draw).toEqual({ index: 2, strategy: "guaranteed" });
  });

  it("guarantees a pick immediately when the threshold is zero", () => {
    const found = [false, false, false];
    const draw = pickDraw(found, 0);
    expect(draw).toEqual({ index: 0, strategy: "guaranteed" });
  });
});

describe("pickInitialOwned", () => {
  it("marks exactly `alreadyOwned` distinct standees as owned", () => {
    const owned = pickInitialOwned(20, 7);
    expect(owned).toHaveLength(20);
    expect(owned.filter(Boolean)).toHaveLength(7);
  });

  it("marks nothing as owned when alreadyOwned is 0", () => {
    const owned = pickInitialOwned(10, 0);
    expect(owned.every((o) => !o)).toBe(true);
  });

  it("clamps to the full set when alreadyOwned exceeds numStandees", () => {
    const owned = pickInitialOwned(5, 100);
    expect(owned).toHaveLength(5);
    expect(owned.every(Boolean)).toBe(true);
  });

  it("follows the Fisher-Yates draw order given a fixed rng", () => {
    const owned = pickInitialOwned(5, 2, () => 0);
    expect(owned).toEqual([true, true, false, false, false]);
  });
});

describe("simulateFullRun", () => {
  it("buys every standee directly under a guaranteed-only strategy (switchStrategyAfter = 0)", () => {
    const result = simulateFullRun(3, 0, 10, 30);
    expect(result).toEqual({
      totalCost: 90,
      randomDraws: 0,
      guaranteedDraws: 3,
    });
  });

  it("accumulates the cost of duplicate random draws under a random-only strategy", () => {
    const rng = vi
      .fn()
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.9);
    const result = simulateFullRun(3, 3, 10, 30, rng);
    expect(result).toEqual({
      totalCost: 40,
      randomDraws: 4,
      guaranteedDraws: 0,
    });
  });

  it("switches from random to guaranteed once the threshold is reached (mixed strategy)", () => {
    const rng = vi.fn().mockReturnValueOnce(0);
    const result = simulateFullRun(3, 1, 10, 30, rng);
    expect(result).toEqual({
      totalCost: 10 + 2 * 30,
      randomDraws: 1,
      guaranteedDraws: 2,
    });
  });
});

describe("harmonicNumber", () => {
  it("returns 0 for n = 0", () => {
    expect(harmonicNumber(0)).toBe(0);
  });

  it("sums 1/i from 1 to n", () => {
    expect(harmonicNumber(3)).toBeCloseTo(1 + 1 / 2 + 1 / 3, 10);
  });
});

describe("expectedRandomDraws", () => {
  it("is 0 when the switch point is 0 (guaranteed from the start)", () => {
    expect(expectedRandomDraws(10, 0)).toBe(0);
  });

  it("matches the classic coupon-collector total (N * H_N) for a pure-random strategy", () => {
    expect(expectedRandomDraws(3, 3)).toBeCloseTo(3 * harmonicNumber(3), 10);
  });

  it("takes exactly 1 expected draw to find the very first standee", () => {
    expect(expectedRandomDraws(3, 1)).toBeCloseTo(1, 10);
  });

  it("clamps the switch point to numStandees", () => {
    expect(expectedRandomDraws(5, 100)).toBeCloseTo(
      expectedRandomDraws(5, 5),
      10,
    );
  });
});

describe("expectedTotalDraws", () => {
  it("is exactly numStandees for a pure-guaranteed strategy", () => {
    expect(expectedTotalDraws(12, 0)).toBe(12);
  });

  it("matches N * H_N for a pure-random strategy", () => {
    expect(expectedTotalDraws(12, 12)).toBeCloseTo(12 * harmonicNumber(12), 10);
  });
});

describe("expectedCost", () => {
  it("is guaranteedCost * numStandees for a pure-guaranteed strategy", () => {
    expect(expectedCost(20, 0, 10, 30)).toBe(30 * 20);
  });

  it("is randomCost * N * H_N for a pure-random strategy", () => {
    expect(expectedCost(20, 20, 10, 30)).toBeCloseTo(
      10 * 20 * harmonicNumber(20),
      8,
    );
  });

  it("agrees with the average of many simulated runs for a mixed strategy", () => {
    const numStandees = 10;
    const switchStrategyAfter = 5;
    const randomCost = 10;
    const guaranteedCost = 30;
    const trials = 4000;

    let totalCost = 0;
    for (let i = 0; i < trials; i++) {
      totalCost += simulateFullRun(
        numStandees,
        switchStrategyAfter,
        randomCost,
        guaranteedCost,
      ).totalCost;
    }
    const simulatedAverage = totalCost / trials;
    const closedForm = expectedCost(
      numStandees,
      switchStrategyAfter,
      randomCost,
      guaranteedCost,
    );

    expect(simulatedAverage).toBeGreaterThan(closedForm * 0.85);
    expect(simulatedAverage).toBeLessThan(closedForm * 1.15);
  });
});

describe("optimalSwitchPoint", () => {
  function bruteForceOptimalCost(
    numStandees: number,
    randomCost: number,
    guaranteedCost: number,
  ): number {
    let best = Infinity;
    for (let k = 0; k <= numStandees; k++) {
      const cost = expectedCost(numStandees, k, randomCost, guaranteedCost);
      if (cost < best) best = cost;
    }
    return best;
  }

  it.each([
    [144, 10, 30],
    [144, 10, 50],
    [144, 10, 15],
    [50, 5, 20],
    [200, 3, 100],
    [144, 25, 30],
    [144, 1, 500],
    [144, 50, 1],
    [12, 1, 100],
    [1, 1, 1],
    [144, 10, 10],
  ])(
    "matches the true minimum cost for numStandees=%i randomCost=%i guaranteedCost=%i",
    (numStandees, randomCost, guaranteedCost) => {
      const k = optimalSwitchPoint(numStandees, randomCost, guaranteedCost);
      const cost = expectedCost(numStandees, k, randomCost, guaranteedCost);
      const trueBest = bruteForceOptimalCost(
        numStandees,
        randomCost,
        guaranteedCost,
      );
      expect(cost).toBeCloseTo(trueBest, 6);
    },
  );

  it("clamps to 0 when guaranteed is cheap enough that random is never worth it", () => {
    expect(optimalSwitchPoint(144, 50, 1)).toBe(0);
  });

  it("clamps to numStandees when random is cheap enough to never switch", () => {
    expect(optimalSwitchPoint(144, 1, 500)).toBe(144);
  });
});

describe("getTier", () => {
  it.each([
    ["Jumping", "black"],
    ["Posing", "black"],
    ["Crouching", "black"],
    ["Swimming", "black"],
    ["Balloon", "gold"],
    ["Goomba", "gold"],
    ["Hoppycat", "gold"],
    ["Spike Ball", "gold"],
    ["Elephant", "silver"],
    ["Fire", "silver"],
    ["Bubble", "silver"],
    ["Drill", "silver"],
  ])("classifies %s as %s", (pose, tier) => {
    expect(getTier(pose)).toBe(tier);
  });

  it("falls back to silver for poses outside the human-cast vocabulary (e.g. Yoshi/Nabbit-only moves)", () => {
    expect(getTier("Cloud")).toBe("silver");
    expect(getTier("Ground Pounding")).toBe("silver");
  });
});
