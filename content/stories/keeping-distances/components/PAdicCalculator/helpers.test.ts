import { describe, it, expect } from "vitest";
import { findLargestPower, displayIntegerDifference } from "./helpers";

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

describe("displayIntegerDifference", () => {
  it("returns a string containing 'lvert' (absolute value notation)", () => {
    expect(displayIntegerDifference(5, 2, 3)).toContain("lvert");
  });

  it("shows '= 0' when num1 equals num2", () => {
    const str = displayIntegerDifference(7, 7, 3);
    expect(str).toContain("0");
    expect(str).not.toContain("frac");
  });

  it("shows '= 1' when the difference has no factor of p", () => {
    // diff = -2, 3 does not divide -2
    const str = displayIntegerDifference(5, 7, 3);
    expect(str).toContain("1");
    expect(str).not.toContain("frac");
  });

  it("shows a fraction when the difference is divisible by p", () => {
    // 11 - 2 = 9 = 3^2 → distance 1/9
    const str = displayIntegerDifference(11, 2, 3);
    expect(str).toContain("frac");
    expect(str).toContain("9"); // 3^2 = 9
  });

  it("includes the prime in the subscript", () => {
    const str = displayIntegerDifference(8, 0, 2);
    // 8 = 2^3, distance = 1/8
    expect(str).toContain("2");
    expect(str).toContain("frac");
  });
});
