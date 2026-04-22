import { describe, it, expect } from "vitest";
import { logGamma, betaPdf } from "./mathHelpers";

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
});
