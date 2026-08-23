import { describe, expect, it } from "vitest";
import { exponential, logistic, model1, model2, model3 } from "./warming-dots";

describe("exponential", () => {
  it("A' = A*y", () => {
    const diffEq = exponential(2);
    expect(diffEq(0, [10])).toEqual([20]);
  });
});

describe("logistic", () => {
  it("A' = A*y*(1 - y/r)", () => {
    const diffEq = logistic(2, 100);
    expect(diffEq(0, [10])).toEqual([2 * 10 * (1 - 10 / 100)]);
  });
});

describe("model1", () => {
  it("computes population and environment derivatives", () => {
    const [A, B, K_0, e_c, C, D] = [1, 0.1, 100, 50, 0.5, 0.2];
    const diffEq = model1(A, B, K_0, e_c, C, D);
    const y: [number, number] = [40, 10];
    const K = K_0 * (1 - y[1] / e_c);
    expect(diffEq(0, y)).toEqual([
      A * y[0] * (1 - y[0] / K) + B * y[0],
      -C * y[1] + D * y[0],
    ]);
  });
});

describe("model2", () => {
  it("dampens the environment derivative via H(Harg)", () => {
    const [A, B, K_0, e_c, C, D, phi, lambda] = [
      1, 0.1, 100, 50, 0.5, 0.2, 0.3, 0.4,
    ];
    const diffEq = model2(A, B, K_0, e_c, C, D, phi, lambda);
    const y: [number, number] = [40, 10];
    const K = K_0 * (1 - y[1] / e_c);
    const Harg = (y[1] / e_c - phi) / lambda;
    const H = (1 + Math.tanh(Harg)) / 2;
    expect(diffEq(0, y)).toEqual([
      A * y[0] * (1 - y[0] / K) + B * y[0],
      -C * y[1] + D * y[0] * (1 - H),
    ]);
  });
});

describe("model3", () => {
  it("adds a quadratic resilience term to the environment derivative", () => {
    const [A, B, K_0, e_c, C, D, phi, lambda, xi] = [
      1, 0.1, 100, 50, 0.5, 0.2, 0.3, 0.4, 0.05,
    ];
    const diffEq = model3(A, B, K_0, e_c, C, D, phi, lambda, xi);
    const y: [number, number] = [40, 10];
    const K = K_0 * (1 - y[1] / e_c);
    const Harg = (y[1] / e_c - phi) / lambda;
    const H = (1 + Math.tanh(Harg)) / 2;
    expect(diffEq(0, y)).toEqual([
      A * y[0] * (1 - y[0] / K) + B * y[0],
      -C * y[1] + (xi * y[1] * y[1]) / e_c + D * y[0] * (1 - H),
    ]);
  });
});
