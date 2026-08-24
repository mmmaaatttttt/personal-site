import { describe, expect, it } from "vitest";
import {
  observedResponseRate,
  observedResponseRatePrime,
  partialAdjustment,
  partialAdjustmentPrime,
} from "./utils";

describe("observedResponseRate", () => {
  it("computes the completer bias when both market completions are 0 (no market effect)", () => {
    const rate = observedResponseRate(0.5, 0.5, 0.9, 0.5, 0, 0);
    expect(rate).toBeCloseTo(0.642857, 5);
  });

  it("is independent of the published probability when both market completions are 0", () => {
    const atLowPrice = observedResponseRate(0, 0.5, 0.9, 0.5, 0, 0);
    const atHighPrice = observedResponseRate(1, 0.5, 0.9, 0.5, 0, 0);
    expect(atLowPrice).toBeCloseTo(atHighPrice, 10);
  });

  it("is unaffected by non-responder market completion when the published probability is 1", () => {
    const noEffect = observedResponseRate(1, 0.5, 0.9, 0.7, 0, 0);
    const highMarketCompletion = observedResponseRate(1, 0.5, 0.9, 0.7, 0, 0.8);
    expect(highMarketCompletion).toBeCloseTo(noEffect, 10);
  });

  it("amplifies the bias as non-responder market completion rises at a low published probability", () => {
    const noEffect = observedResponseRate(0, 0.5, 0.9, 0.7, 0, 0);
    const highMarketCompletion = observedResponseRate(0, 0.5, 0.9, 0.7, 0, 0.8);
    expect(highMarketCompletion).toBeGreaterThan(noEffect);
  });

  it("cancels out and matches the no-effect rate when both market completions are equal", () => {
    const noEffect = observedResponseRate(0, 0.5, 0.9, 0.7, 0, 0);
    const equalMarketCompletion = observedResponseRate(
      0,
      0.5,
      0.9,
      0.7,
      0.8,
      0.8,
    );
    expect(equalMarketCompletion).toBeCloseTo(noEffect, 10);
  });

  it("flips the bias below the no-effect rate when responder market completion is higher than non-responder's", () => {
    const noEffect = observedResponseRate(0, 0.5, 0.9, 0.7, 0, 0);
    const invertedMarketCompletion = observedResponseRate(
      0,
      0.5,
      0.9,
      0.7,
      0.8,
      0,
    );
    expect(invertedMarketCompletion).toBeLessThan(noEffect);
  });

  it("always returns a value in [0, 1]", () => {
    const rate = observedResponseRate(0.3, 0.2, 0.95, 0.45, 0.6, 0);
    expect(rate).toBeGreaterThanOrEqual(0);
    expect(rate).toBeLessThanOrEqual(1);
  });

  it("takes the L'Hopital limit instead of NaN when both groups' survival hits 0 at p = 0", () => {
    const rate = observedResponseRate(0, 0.25, 1, 0.4, 1, 1);
    expect(rate).toBeCloseTo(0.454545, 5);
  });

  it("matches the limiting value found just above p = 0", () => {
    const atZero = observedResponseRate(0, 0.25, 1, 0.4, 1, 1);
    const justAbove = observedResponseRate(0.0001, 0.25, 1, 0.4, 1, 1);
    expect(atZero).toBeCloseTo(justAbove, 4);
  });

  it("takes the limit even when only the responder-driven route to 0 applies (true rate is 0)", () => {
    const rate = observedResponseRate(0, 0, 0.9, 0.7, 0.3, 1);
    expect(rate).toBeCloseTo(0, 10);
  });
});

describe("observedResponseRatePrime", () => {
  it("matches a numerical approximation of the derivative", () => {
    const args: [number, number, number, number, number] = [
      0.5, 0.9, 0.7, 0.3, 0.5,
    ];
    const p = 0.4;
    const h = 1e-6;
    const numerical =
      (observedResponseRate(p + h, ...args) -
        observedResponseRate(p - h, ...args)) /
      (2 * h);
    const analytic = observedResponseRatePrime(p, ...args);
    expect(analytic).toBeCloseTo(numerical, 4);
  });

  it("is zero when both market completions are 0, since the map is flat", () => {
    const derivative = observedResponseRatePrime(0.4, 0.5, 0.9, 0.7, 0, 0);
    expect(derivative).toBeCloseTo(0, 10);
  });

  it("is zero at the removable discontinuity where both groups' survival hits 0 at p = 0", () => {
    const derivative = observedResponseRatePrime(0, 0.25, 1, 0.4, 1, 1);
    expect(derivative).toBeCloseTo(0, 10);
  });

  it("is zero when both market completions are equal, since the map is flat", () => {
    const derivative = observedResponseRatePrime(0.4, 0.5, 0.9, 0.7, 0.6, 0.6);
    expect(derivative).toBeCloseTo(0, 10);
  });
});

describe("partialAdjustment", () => {
  it("returns the target exactly at adjustmentSpeed 1 (full pass-through)", () => {
    expect(partialAdjustment(0.8, 0.3, 1)).toBeCloseTo(0.8, 10);
  });

  it("returns the current value unchanged at adjustmentSpeed 0", () => {
    expect(partialAdjustment(0.8, 0.3, 0)).toBeCloseTo(0.3, 10);
  });

  it("blends proportionally between current and target", () => {
    expect(partialAdjustment(1, 0, 0.25)).toBeCloseTo(0.25, 10);
  });

  it("leaves the value unchanged when target equals current, regardless of speed", () => {
    expect(partialAdjustment(0.5, 0.5, 0.37)).toBeCloseTo(0.5, 10);
  });
});

describe("partialAdjustmentPrime", () => {
  it("equals the target's derivative at adjustmentSpeed 1", () => {
    expect(partialAdjustmentPrime(2, 1)).toBeCloseTo(2, 10);
  });

  it("equals 1 at adjustmentSpeed 0, since the map degenerates to the identity", () => {
    expect(partialAdjustmentPrime(5, 0)).toBeCloseTo(1, 10);
  });

  it("matches a numerical derivative of partialAdjustment", () => {
    const target = (p: number) => p * p;
    const targetPrime = (p: number) => 2 * p;
    const speed = 0.4;
    const p = 0.6;
    const h = 1e-6;
    const numerical =
      (partialAdjustment(target(p + h), p + h, speed) -
        partialAdjustment(target(p - h), p - h, speed)) /
      (2 * h);
    const analytic = partialAdjustmentPrime(targetPrime(p), speed);
    expect(analytic).toBeCloseTo(numerical, 4);
  });
});
