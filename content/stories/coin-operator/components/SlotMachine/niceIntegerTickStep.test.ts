import { describe, expect, it } from "vitest";
import { niceIntegerTickStep } from "./niceIntegerTickStep";

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
