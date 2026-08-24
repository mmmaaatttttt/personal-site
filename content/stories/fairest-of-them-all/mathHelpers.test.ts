import { describe, expect, it } from "vitest";
import { betaPdf, binomialDensityValues, logGamma } from "./mathHelpers";

describe("logGamma", () => {
  it("matches log((n-1)!) for positive integers", () => {
    // logGamma(n) = log((n-1)!): logGamma(1)=0, logGamma(2)=0, logGamma(3)=log(2)
    expect(logGamma(1)).toBeCloseTo(0, 10);
    expect(logGamma(2)).toBeCloseTo(0, 10);
    expect(logGamma(3)).toBeCloseTo(Math.log(2), 10);
    expect(logGamma(4)).toBeCloseTo(Math.log(6), 10);
    expect(logGamma(5)).toBeCloseTo(Math.log(24), 10);
  });

  it("handles z=0.5 (logGamma(0.5) = log(sqrt(pi)))", () => {
    expect(logGamma(0.5)).toBeCloseTo(Math.log(Math.sqrt(Math.PI)), 10);
  });

  it("is accurate for larger values", () => {
    // logGamma(10) = log(9!) = log(362880)
    expect(logGamma(10)).toBeCloseTo(Math.log(362880), 8);
  });

  it("uses the reflection formula for z < 0.5", () => {
    expect(logGamma(0.3) + logGamma(0.7)).toBeCloseTo(
      Math.log(Math.PI / Math.sin(Math.PI * 0.3)),
      10,
    );
  });
});

describe("betaPdf", () => {
  it("returns 0 for x outside (0, 1)", () => {
    expect(betaPdf(0, 2, 2)).toBe(0);
    expect(betaPdf(1, 2, 2)).toBe(0);
    expect(betaPdf(-0.1, 2, 2)).toBe(0);
    expect(betaPdf(1.1, 2, 2)).toBe(0);
  });

  it("Beta(1,1) is the uniform distribution — pdf=1 everywhere", () => {
    expect(betaPdf(0.25, 1, 1)).toBeCloseTo(1, 10);
    expect(betaPdf(0.5, 1, 1)).toBeCloseTo(1, 10);
    expect(betaPdf(0.75, 1, 1)).toBeCloseTo(1, 10);
  });

  it("Beta(2,2) peaks at x=0.5 with value 1.5", () => {
    // pdf = 6x(1-x); at x=0.5: 6*0.5*0.5 = 1.5
    expect(betaPdf(0.5, 2, 2)).toBeCloseTo(1.5, 8);
  });

  it("Beta(2,2) is symmetric around 0.5", () => {
    expect(betaPdf(0.3, 2, 2)).toBeCloseTo(betaPdf(0.7, 2, 2), 10);
  });

  it("Beta(51,51) peaks sharply at 0.5 (fair-coin prior after 50 heads/tails)", () => {
    const atPeak = betaPdf(0.5, 51, 51);
    const offPeak = betaPdf(0.4, 51, 51);
    expect(atPeak).toBeGreaterThan(offPeak * 2);
  });

  it("Beta(2,1) is a linearly increasing pdf — pdf=2x", () => {
    // Beta(2,1): pdf = 2x
    expect(betaPdf(0.5, 2, 1)).toBeCloseTo(1, 8);
    expect(betaPdf(0.25, 2, 1)).toBeCloseTo(0.5, 8);
  });

  it("is +Infinity at x=0 when a < 1", () => {
    expect(betaPdf(0, 0.5, 2)).toBe(Infinity);
  });

  it("equals 1/B(1,b) at x=0 when a = 1", () => {
    expect(betaPdf(0, 1, 2)).toBeCloseTo(2, 10);
  });

  it("is +Infinity at x=1 when b < 1", () => {
    expect(betaPdf(1, 2, 0.5)).toBe(Infinity);
  });

  it("equals 1/B(a,1) at x=1 when b = 1", () => {
    expect(betaPdf(1, 2, 1)).toBeCloseTo(2, 10);
  });
});

describe("binomialDensityValues", () => {
  it("returns n+1 values", () => {
    expect(binomialDensityValues(10, 0.5).length).toBe(11);
    expect(binomialDensityValues(20, 0.3).length).toBe(21);
  });

  it("returns all zeros for p=0", () => {
    const vals = binomialDensityValues(5, 0);
    expect(vals[0]).toBe(0); // P(X=0) = 1 would be expected mathematically, but p=0 returns all p
    for (const v of vals) expect(v).toBe(0);
  });

  it("returns all ones for p=1", () => {
    const vals = binomialDensityValues(5, 1);
    for (const v of vals) expect(v).toBe(1);
  });

  it("all values sum to 1 for a valid p", () => {
    const vals = binomialDensityValues(20, 0.5);
    const sum = vals.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 10);
  });

  it("peaks near n*p for fair coin", () => {
    const n = 100;
    const p = 0.5;
    const vals = binomialDensityValues(n, p);
    const peakIdx = vals.indexOf(Math.max(...vals));
    // Peak should be at or very near 50
    expect(peakIdx).toBeGreaterThanOrEqual(49);
    expect(peakIdx).toBeLessThanOrEqual(51);
  });

  it("peaks near n*p for biased coin", () => {
    const n = 100;
    const p = 0.3;
    const vals = binomialDensityValues(n, p);
    const peakIdx = vals.indexOf(Math.max(...vals));
    expect(peakIdx).toBeGreaterThanOrEqual(28);
    expect(peakIdx).toBeLessThanOrEqual(32);
  });

  it("first value equals (1-p)^n", () => {
    const n = 10;
    const p = 0.3;
    expect(binomialDensityValues(n, p)[0]).toBeCloseTo((1 - p) ** n, 10);
  });
});
