import { describe, expect, it } from "vitest";
import { niceIntegerTickStep, niceIntegerTickValues } from "./niceIntegerTicks";

describe("niceIntegerTickStep", () => {
  it("floors a fractional d3 step to 1 for a small domain", () => {
    // d3's tickStep(0, 3, 8) is fractional (< 1) — must floor to 1.
    expect(niceIntegerTickStep(0, 3, 8)).toBe(1);
  });

  it("returns a larger nice step for a wide domain instead of always 1", () => {
    const step = niceIntegerTickStep(0, 1000, 8);
    expect(step).toBeGreaterThan(1);
  });

  it("never produces a fractional step", () => {
    for (const max of [2, 5, 10, 50, 200, 1000, 10000]) {
      expect(Number.isInteger(niceIntegerTickStep(0, max, 8))).toBe(true);
    }
  });
});

describe("niceIntegerTickValues", () => {
  it("never includes a value past max, even when max isn't a step multiple", () => {
    // domain [0, 15] with a step of 2 would overshoot to 16 using d3-axis's
    // own range(domain[0], domain[1] + step, step) approach — this must not.
    const values = niceIntegerTickValues(0, 15, 8);
    expect(Math.max(...values)).toBeLessThanOrEqual(15);
  });

  it("starts at min and steps evenly", () => {
    const values = niceIntegerTickValues(0, 10, 8);
    expect(values[0]).toBe(0);
    const step = values[1] - values[0];
    for (let i = 1; i < values.length; i++) {
      expect(values[i] - values[i - 1]).toBe(step);
    }
  });

  it("includes max exactly when max is a multiple of the step", () => {
    const values = niceIntegerTickValues(0, 50, 10);
    expect(values.at(-1)).toBe(50);
  });
});
