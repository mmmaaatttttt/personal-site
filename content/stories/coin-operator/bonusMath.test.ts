import { describe, expect, it } from "vitest";
import {
  boundedRationalActionValues,
  boundedRationalExpectedValueCurve,
  evaluateActions,
  machineExpectedValue,
  machineExpectedValueCurve,
  optimalStrategy,
  softmaxProbabilities,
  softmaxWeightedValue,
} from "./bonusMath";
import { type SlotResult, SlotValue } from "./data";
import { calculatePayout } from "./math";
import { expectedValue } from "./tableData";

describe("evaluateActions", () => {
  it("offers no spin actions when no spins remain", () => {
    const state: SlotResult = [
      SlotValue.DASH,
      SlotValue.DASH,
      SlotValue.DASH,
      SlotValue.DASH,
    ];
    const result = evaluateActions(state, 0);

    expect(result.stay).toBe(calculatePayout(state));
    expect(result.spin).toEqual({});
  });

  it("accounts for the DOUBLE multiplier in the stay value", () => {
    const state: SlotResult = [
      SlotValue.CLOVER,
      SlotValue.CLOVER,
      SlotValue.DOUBLE,
      SlotValue.DOUBLE,
    ];
    const result = evaluateActions(state, 0);

    expect(result.stay).toBe(80);
  });

  it("keys spin actions by distinct symbol, not slot index", () => {
    const state: SlotResult = [
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.DASH,
    ];
    const result = evaluateActions(state, 1);

    expect(Object.keys(result.spin).sort()).toEqual(
      [SlotValue.CROWN, SlotValue.DASH].sort(),
    );
  });
});

describe("optimalStrategy", () => {
  it("always stays when no spins remain", () => {
    const state: SlotResult = [
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.DASH,
    ];
    const result = optimalStrategy(state, 0);

    expect(result.action).toBe("stay");
    expect(result.value).toBe(calculatePayout(state));
  });

  it("stays on an already-maximal jackpot rather than risk a respin", () => {
    const state: SlotResult = [
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.CROWN,
    ];
    const result = optimalStrategy(state, 3);

    expect(result.action).toBe("stay");
    expect(result.value).toBe(100);
  });

  it("prefers spinning the dead slot when three symbols are one away from jackpot", () => {
    const state: SlotResult = [
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.DASH,
    ];
    const result = optimalStrategy(state, 3);

    expect(result.action).toBe(SlotValue.DASH);
    expect(result.value).toBeGreaterThan(0);
  });

  it("is invariant to the order symbols appear in the input", () => {
    const stateA: SlotResult = [
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.DASH,
    ];
    const stateB: SlotResult = [
      SlotValue.DASH,
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.CROWN,
    ];

    expect(optimalStrategy(stateA, 2)).toEqual(optimalStrategy(stateB, 2));
  });

  it("increases in value (weakly) as more bonus spins become available", () => {
    const state: SlotResult = [
      SlotValue.COIN_1,
      SlotValue.COIN_1,
      SlotValue.DASH,
      SlotValue.DASH,
    ];

    const zero = optimalStrategy(state, 0).value;
    const one = optimalStrategy(state, 1).value;
    const two = optimalStrategy(state, 2).value;

    expect(one).toBeGreaterThanOrEqual(zero);
    expect(two).toBeGreaterThanOrEqual(one);
  });
});

describe("machineExpectedValue", () => {
  it("matches the existing 0-bonus-spin expected value, net of the initial coin", () => {
    expect(machineExpectedValue(0)).toBeCloseTo(expectedValue - 1, 10);
  });

  it("increases (weakly) as more bonus spins become available", () => {
    const zero = machineExpectedValue(0);
    const one = machineExpectedValue(1);
    const two = machineExpectedValue(2);
    const three = machineExpectedValue(3);

    expect(one).toBeGreaterThanOrEqual(zero);
    expect(two).toBeGreaterThanOrEqual(one);
    expect(three).toBeGreaterThanOrEqual(two);
  });
});

describe("machineExpectedValueCurve", () => {
  it("returns one entry per spin count from 0 to maxSpinsRemaining, matching machineExpectedValue", () => {
    const curve = machineExpectedValueCurve(4);

    expect(curve).toHaveLength(5);
    curve.forEach((value, n) => {
      expect(value).toBe(machineExpectedValue(n));
    });
  });
});

describe("softmaxProbabilities", () => {
  it("puts all probability on the max value at temperature 0", () => {
    expect(softmaxProbabilities([3, 9, -2], 0)).toEqual([0, 1, 0]);
  });

  it("breaks ties at temperature 0 by taking the first max", () => {
    expect(softmaxProbabilities([5, 5, 1], 0)).toEqual([1, 0, 0]);
  });

  it("is uniform at infinite temperature, ignoring the values", () => {
    expect(softmaxProbabilities([3, 9, -2], Infinity)).toEqual([
      1 / 3,
      1 / 3,
      1 / 3,
    ]);
  });

  it("sums to 1 at a moderate temperature", () => {
    const probabilities = softmaxProbabilities([10, 0], 5);
    expect(probabilities[0] + probabilities[1]).toBeCloseTo(1, 10);
    expect(probabilities[0]).toBeGreaterThan(probabilities[1]);
  });

  it("splits evenly when all options are tied", () => {
    const probabilities = softmaxProbabilities([4, 4, 4], 2);
    for (const p of probabilities) {
      expect(p).toBeCloseTo(1 / 3, 10);
    }
  });
});

describe("softmaxWeightedValue", () => {
  it("collapses to the max value at temperature 0, matching a fully rational player", () => {
    expect(softmaxWeightedValue([3, 9, -2], 0)).toBe(9);
  });

  it("collapses to a plain average at infinite temperature", () => {
    expect(softmaxWeightedValue([3, 9, -2], Infinity)).toBeCloseTo(
      (3 + 9 - 2) / 3,
      10,
    );
  });

  it("weights higher values more heavily at a moderate temperature", () => {
    const result = softmaxWeightedValue([10, 0], 5);

    // Strictly between the two values, but pulled toward the higher one.
    expect(result).toBeGreaterThan(5);
    expect(result).toBeLessThan(10);
  });

  it("returns the shared value when all options are tied", () => {
    expect(softmaxWeightedValue([4, 4, 4], 2)).toBeCloseTo(4, 10);
  });
});

describe("boundedRationalActionValues", () => {
  it("matches evaluateActions exactly at temperature 0", () => {
    const state: SlotResult = [
      SlotValue.COIN_1,
      SlotValue.COIN_1,
      SlotValue.COIN_3,
      SlotValue.COIN_3,
    ];

    const optimal = evaluateActions(state, 5);
    const bounded = boundedRationalActionValues(state, 5, 0);

    expect(bounded.stay).toBe(optimal.stay);
    expect(bounded.spin[SlotValue.COIN_1]).toBeCloseTo(
      optimal.spin[SlotValue.COIN_1] as number,
      9,
    );
    expect(bounded.spin[SlotValue.COIN_3]).toBeCloseTo(
      optimal.spin[SlotValue.COIN_3] as number,
      9,
    );
  });

  it("degrades below the optimal spin value at a high temperature", () => {
    const state: SlotResult = [
      SlotValue.COIN_1,
      SlotValue.COIN_1,
      SlotValue.COIN_3,
      SlotValue.COIN_3,
    ];

    const optimal = evaluateActions(state, 5);
    const bounded = boundedRationalActionValues(state, 5, 1);

    expect(bounded.spin[SlotValue.COIN_1] as number).toBeLessThan(
      optimal.spin[SlotValue.COIN_1] as number,
    );
    expect(bounded.spin[SlotValue.COIN_3] as number).toBeLessThan(
      optimal.spin[SlotValue.COIN_3] as number,
    );
  });

  it("offers no spin actions when no spins remain", () => {
    const state: SlotResult = [
      SlotValue.DASH,
      SlotValue.DASH,
      SlotValue.DASH,
      SlotValue.DASH,
    ];
    const result = boundedRationalActionValues(state, 0, 1);

    expect(result.stay).toBe(calculatePayout(state));
    expect(result.spin).toEqual({});
  });
});

describe("boundedRationalExpectedValueCurve", () => {
  it("returns one entry per spin count from 0 to maxSpinsRemaining", () => {
    const curve = boundedRationalExpectedValueCurve(4, 1);
    expect(curve).toHaveLength(5);
  });

  it("nearly matches optimal play at a near-zero temperature", () => {
    const optimalCurve = machineExpectedValueCurve(3);
    const boundedCurve = boundedRationalExpectedValueCurve(3, 1e-9);

    boundedCurve.forEach((value, n) => {
      expect(value).toBeCloseTo(optimalCurve[n], 6);
    });
  });

  it("falls below optimal play once mistakes become likely (higher temperature)", () => {
    const optimalCurve = machineExpectedValueCurve(3);
    const boundedCurve = boundedRationalExpectedValueCurve(3, 50);

    for (let n = 1; n <= 3; n++) {
      expect(boundedCurve[n]).toBeLessThan(optimalCurve[n]);
    }
  });
});
