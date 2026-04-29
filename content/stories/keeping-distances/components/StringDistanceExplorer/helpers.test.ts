import { describe, it, expect } from "vitest";
import {
  hammingDistance,
  levenshteinDistance,
  damerauLevenshteinDistance,
} from "./helpers";

describe("hammingDistance", () => {
  it("returns 0 for identical strings", () => {
    expect(hammingDistance("abc", "abc")).toBe(0);
  });

  it("counts positions where characters differ", () => {
    expect(hammingDistance("ghost", "roast")).toBe(3);
    expect(hammingDistance("abc", "xyz")).toBe(3);
    expect(hammingDistance("abc", "axc")).toBe(1);
  });

  it("throws for strings of different lengths", () => {
    expect(() => hammingDistance("abc", "ab")).toThrow();
    expect(() => hammingDistance("a", "abc")).toThrow();
  });

  it("handles empty strings", () => {
    expect(hammingDistance("", "")).toBe(0);
  });
});

describe("levenshteinDistance", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshteinDistance("abc", "abc")).toBe(0);
  });

  it("returns length of non-empty string when other is empty", () => {
    expect(levenshteinDistance("abc", "")).toBe(3);
    expect(levenshteinDistance("", "abc")).toBe(3);
  });

  it("computes single-edit operations correctly", () => {
    expect(levenshteinDistance("cat", "bat")).toBe(1); // substitution
    expect(levenshteinDistance("cat", "cats")).toBe(1); // insertion
    expect(levenshteinDistance("cats", "cat")).toBe(1); // deletion
  });

  it("computes multi-edit distance correctly", () => {
    expect(levenshteinDistance("friend", "foe")).toBe(4);
  });

  it("is symmetric", () => {
    expect(levenshteinDistance("kitten", "sitting")).toBe(
      levenshteinDistance("sitting", "kitten")
    );
  });

  it("tree vs reed — edit distance is shorter than hamming", () => {
    expect(levenshteinDistance("tree", "reed")).toBe(2);
  });
});

describe("damerauLevenshteinDistance", () => {
  it("returns 0 for identical strings", () => {
    expect(damerauLevenshteinDistance("abc", "abc")).toBe(0);
  });

  it("counts a transposition as 1 edit", () => {
    // 'matehmatics' vs 'mathematics': swapping 't' and 'h' is a transposition
    expect(damerauLevenshteinDistance("matehmatics", "mathematics")).toBe(1);
  });

  it("falls back to levenshtein when no transpositions exist", () => {
    expect(damerauLevenshteinDistance("cat", "bat")).toBe(1);
    expect(damerauLevenshteinDistance("friend", "foe")).toBe(4);
  });

  it("is symmetric", () => {
    expect(damerauLevenshteinDistance("ab", "ba")).toBe(
      damerauLevenshteinDistance("ba", "ab")
    );
  });

  it("transposition plus substitution counts correctly", () => {
    // 'ab' → 'ba' is 1 transposition
    expect(damerauLevenshteinDistance("ab", "ba")).toBe(1);
  });
});
