import { describe, expect, it } from "vitest";
import { generateFreqMap, groupBy } from "./arrayHelpers";

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

describe("groupBy", () => {
  it("partitions items by key, preserving item order within a group", () => {
    const items = [
      { name: "a", tag: "x" },
      { name: "b", tag: "y" },
      { name: "c", tag: "x" },
    ];
    const groups = groupBy(items, (item) => item.tag);
    expect(groups.get("x")).toEqual([items[0], items[2]]);
    expect(groups.get("y")).toEqual([items[1]]);
  });

  it("merges non-consecutive occurrences of the same key into one group", () => {
    const groups = groupBy(["a", "b", "a"], (item) => item);
    expect(groups.get("a")).toEqual(["a", "a"]);
    expect(groups.size).toBe(2);
  });

  it("preserves first-seen key order", () => {
    const groups = groupBy(["b", "a", "b"], (item) => item);
    expect(Array.from(groups.keys())).toEqual(["b", "a"]);
  });

  it("returns an empty map for an empty array", () => {
    expect(groupBy([], (item) => item).size).toBe(0);
  });
});
