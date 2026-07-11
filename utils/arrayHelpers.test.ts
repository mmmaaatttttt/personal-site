import { describe, expect, it } from "vitest";
import { generateFreqMap } from "./arrayHelpers";

describe("generateFreqMap", () => {
  it("counts occurrences correctly", () => {
    const map = generateFreqMap(["a", "b", "a", "c", "b", "a"]);
    expect(map.get("a")).toBe(3);
    expect(map.get("b")).toBe(2);
    expect(map.get("c")).toBe(1);
  });

  it("returns an empty map for an empty array", () => {
    expect(generateFreqMap([]).size).toBe(0);
  });

  it("handles a single-element array", () => {
    const map = generateFreqMap(["x"]);
    expect(map.get("x")).toBe(1);
    expect(map.size).toBe(1);
  });

  it("works with non-string types", () => {
    const map = generateFreqMap([1, 2, 1, 3, 2, 1]);
    expect(map.get(1)).toBe(3);
    expect(map.get(2)).toBe(2);
    expect(map.get(3)).toBe(1);
  });
});
