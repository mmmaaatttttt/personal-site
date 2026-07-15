import { describe, expect, it } from "vitest";
import {
  evaluateActions,
  machineExpectedValue,
  optimalStrategy,
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
  it("matches the existing 0-bonus-spin expected value", () => {
    expect(machineExpectedValue(0)).toBeCloseTo(expectedValue, 10);
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
