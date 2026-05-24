import { describe, expect, it } from "vitest";
import { jaccardDistance } from "./content";

describe("jaccardDistance", () => {
  it("returns 0 for identical arrays", () => {
    expect(jaccardDistance(["a", "b", "c"], ["a", "b", "c"])).toBe(0);
  });

  it("returns 1 for completely disjoint arrays", () => {
    expect(jaccardDistance(["a", "b"], ["c", "d"])).toBe(1);
  });

  it("returns 1 for two empty arrays", () => {
    expect(jaccardDistance([], [])).toBe(1);
  });

  it("returns 0.5 for half-overlapping arrays", () => {
    // intersection {a}, union {a, b} → distance = 1 - 1/2 = 0.5
    expect(jaccardDistance(["a", "b"], ["a"])).toBe(0.5);
  });

  it("returns a value between 0 and 1 for partial overlap", () => {
    const d = jaccardDistance(
      ["math", "probability", "games"],
      ["games", "politics"],
    );
    expect(d).toBeGreaterThan(0);
    expect(d).toBeLessThan(1);
  });

  it("is symmetric", () => {
    const a = ["math", "probability"];
    const b = ["games", "probability"];
    expect(jaccardDistance(a, b)).toBe(jaccardDistance(b, a));
  });

  it("returns 0 when one array is a subset of the other (same elements)", () => {
    expect(jaccardDistance(["a"], ["a", "a"])).toBe(0);
  });
});
