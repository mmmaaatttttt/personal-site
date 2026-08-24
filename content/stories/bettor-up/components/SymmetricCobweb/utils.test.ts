import { describe, expect, it } from "vitest";
import { symmetricMap, symmetricMapPrime } from "./utils";

describe("symmetricMap", () => {
  it("always has a fixed point at probability 0.5 regardless of responseStrength", () => {
    expect(symmetricMap(0.5, 2)).toBeCloseTo(0.5, 10);
    expect(symmetricMap(0.5, 12)).toBeCloseTo(0.5, 10);
  });

  it("computes the sigmoid value for a given probability and responseStrength", () => {
    expect(symmetricMap(0.1, 2)).toBeCloseTo(0.31, 3);
  });

  it("is monotonically increasing in probability", () => {
    const responseStrength = 6;
    expect(symmetricMap(0.2, responseStrength)).toBeLessThan(
      symmetricMap(0.4, responseStrength),
    );
    expect(symmetricMap(0.4, responseStrength)).toBeLessThan(
      symmetricMap(0.6, responseStrength),
    );
  });
});

describe("symmetricMapPrime", () => {
  it("equals responseStrength / 4 at the fixed point probability 0.5", () => {
    expect(symmetricMapPrime(0.5, 4)).toBeCloseTo(1, 10);
    expect(symmetricMapPrime(0.5, 8)).toBeCloseTo(2, 10);
  });

  it("is always positive since the sigmoid is monotonically increasing", () => {
    expect(symmetricMapPrime(0.1, 6)).toBeGreaterThan(0);
    expect(symmetricMapPrime(0.9, 6)).toBeGreaterThan(0);
  });
});
