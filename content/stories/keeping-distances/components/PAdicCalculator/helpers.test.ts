import { describe, expect, it } from "vitest";
import { displayIntegerDifference } from "./helpers";

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
