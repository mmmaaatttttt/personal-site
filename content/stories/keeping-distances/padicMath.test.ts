import { describe, expect, it } from "vitest";
import { findLargestPower } from "./padicMath";

describe("findLargestPower", () => {
  it("returns 0 when p does not divide n", () => {
    expect(findLargestPower(7, 3)).toBe(0);
    expect(findLargestPower(5, 2)).toBe(0);
    expect(findLargestPower(11, 3)).toBe(0);
  });

  it("returns the correct exponent for exact powers of p", () => {
    expect(findLargestPower(9, 3)).toBe(2); // 9 = 3^2
    expect(findLargestPower(8, 2)).toBe(3); // 8 = 2^3
    expect(findLargestPower(25, 5)).toBe(2); // 25 = 5^2
  });

  it("returns the correct exponent when p divides n but n is not a power of p", () => {
    expect(findLargestPower(12, 2)).toBe(2); // 12 = 2^2 * 3
    expect(findLargestPower(12, 3)).toBe(1); // 12 = 2^2 * 3
    expect(findLargestPower(18, 3)).toBe(2); // 18 = 2 * 3^2
  });

  it("uses absolute value so negatives behave the same as positives", () => {
    expect(findLargestPower(-9, 3)).toBe(2);
    expect(findLargestPower(-12, 2)).toBe(2);
  });

  it("returns 0 for n = 1 (1 has no prime factors)", () => {
    expect(findLargestPower(1, 2)).toBe(0);
    expect(findLargestPower(1, 7)).toBe(0);
  });
});
