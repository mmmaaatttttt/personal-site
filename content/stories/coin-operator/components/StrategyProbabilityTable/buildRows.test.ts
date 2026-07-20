import { describe, expect, it } from "vitest";
import type { ActionValues } from "../../bonusMath";
import { SlotValue } from "../../data";
import { buildRows } from "./buildRows";

const optimalValues: ActionValues = {
  stay: 0,
  spin: {
    [SlotValue.COIN_1]: 0.4438063069999997,
    [SlotValue.COIN_3]: 0.46272493245000035,
  },
};

const boundedValuesAtT1: ActionValues = {
  stay: 0,
  spin: {
    [SlotValue.COIN_1]: -0.19225154369649333,
    [SlotValue.COIN_3]: -0.06428458066060434,
  },
};

describe("buildRows", () => {
  it("returns one row per action, in stay/single-coin/3-coin order", () => {
    const rows = buildRows(optimalValues, boundedValuesAtT1, 1);

    expect(rows.map((r) => r.key)).toEqual([
      "stay",
      SlotValue.COIN_1,
      SlotValue.COIN_3,
    ]);
    expect(rows.map((r) => r.label)).toEqual(["Stay", "Spin 🟡", "Spin 💰"]);
  });

  it("reports the true-optimal expected value per row, independent of temperature", () => {
    const rows = buildRows(optimalValues, boundedValuesAtT1, 1);

    expect(rows.find((r) => r.key === "stay")?.expectedValue).toBe(0);
    expect(rows.find((r) => r.key === SlotValue.COIN_1)?.expectedValue).toBe(
      0.4438063069999997,
    );
    expect(rows.find((r) => r.key === SlotValue.COIN_3)?.expectedValue).toBe(
      0.46272493245000035,
    );
  });

  it("gives the random column a uniform distribution regardless of values", () => {
    const rows = buildRows(optimalValues, boundedValuesAtT1, 1);

    for (const row of rows) {
      expect(row.random).toBeCloseTo(1 / 3, 10);
    }
  });

  it("gives the optimized column a hard argmax over the true optimal values", () => {
    const rows = buildRows(optimalValues, boundedValuesAtT1, 1);

    // COIN_3 has the highest optimal value (0.4627 > 0.4438 > 0).
    expect(rows.find((r) => r.key === "stay")?.optimized).toBe(0);
    expect(rows.find((r) => r.key === SlotValue.COIN_1)?.optimized).toBe(0);
    expect(rows.find((r) => r.key === SlotValue.COIN_3)?.optimized).toBe(1);
  });

  it("marks only the row with a hard-argmax optimized value of 1 as optimal", () => {
    const rows = buildRows(optimalValues, boundedValuesAtT1, 1);

    expect(rows.find((r) => r.key === "stay")?.isOptimal).toBe(false);
    expect(rows.find((r) => r.key === SlotValue.COIN_1)?.isOptimal).toBe(false);
    expect(rows.find((r) => r.key === SlotValue.COIN_3)?.isOptimal).toBe(true);
  });

  it("computes the current column from the bounded-rational values at the given temperature", () => {
    const rows = buildRows(optimalValues, boundedValuesAtT1, 1);

    expect(rows.find((r) => r.key === "stay")?.current).toBeCloseTo(
      0.36194674446995023,
      9,
    );
    expect(rows.find((r) => r.key === SlotValue.COIN_1)?.current).toBeCloseTo(
      0.29864200327685747,
      9,
    );
    expect(rows.find((r) => r.key === SlotValue.COIN_3)?.current).toBeCloseTo(
      0.33941125225319246,
      9,
    );
  });
});
