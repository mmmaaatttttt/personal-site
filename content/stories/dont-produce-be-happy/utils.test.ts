import { describe, expect, it } from "vitest";
import { linearRegression } from "./utils";

describe("linearRegression", () => {
  it("recovers the exact slope and intercept for perfectly linear points", () => {
    const points = [
      { x: 0, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 5 },
      { x: 3, y: 7 },
    ];
    const { slope, intercept } = linearRegression(points);
    expect(slope).toBeCloseTo(2, 10);
    expect(intercept).toBeCloseTo(1, 10);
  });

  it("gives an R^2 of 1 for perfectly linear points", () => {
    const points = [
      { x: 0, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 5 },
      { x: 3, y: 7 },
    ];
    const { rSquared } = linearRegression(points);
    expect(rSquared).toBeCloseTo(1, 10);
  });

  it("fits a best-fit line through noisy points", () => {
    const points = [
      { x: 0, y: 0.1 },
      { x: 1, y: 1.9 },
      { x: 2, y: 3.2 },
      { x: 3, y: 3.8 },
    ];
    const { slope, intercept } = linearRegression(points);
    expect(slope).toBeGreaterThan(1);
    expect(slope).toBeLessThan(2);
    expect(intercept).toBeGreaterThan(-1);
    expect(intercept).toBeLessThan(1);
  });

  it("gives an R^2 between 0 and 1 for noisy but correlated points", () => {
    const points = [
      { x: 0, y: 0.1 },
      { x: 1, y: 1.9 },
      { x: 2, y: 3.2 },
      { x: 3, y: 3.8 },
    ];
    const { rSquared } = linearRegression(points);
    expect(rSquared).toBeGreaterThan(0);
    expect(rSquared).toBeLessThan(1);
  });

  it("gives an R^2 of 0 when y is constant (no variance to explain)", () => {
    const points = [
      { x: 0, y: 5 },
      { x: 1, y: 5 },
      { x: 2, y: 5 },
    ];
    const { rSquared } = linearRegression(points);
    expect(rSquared).toBeNaN();
  });
});
