import { describe, expect, it } from "vitest";
import { nonlinearVisData } from "./data";

describe("nonlinearVisData diffEqs", () => {
  it("linearDiffEq: A' = a*B + c*A, B' = b*A + d*B", () => {
    const diffEq = nonlinearVisData[0].diffEqs[0](2, 3, 4, 5);
    expect(diffEq(0, [5, 7])).toEqual([2 * 7 + 3 * 5, 4 * 5 + 5 * 7]);
  });

  it("nonlinearDiffEq2 dampens intensity by (1 - |y|)", () => {
    const diffEq = nonlinearVisData[0].diffEqs[1](2, 3, 4, 5);
    const y: [number, number] = [0.5, 0.3];
    expect(diffEq(0, y)).toEqual([
      2 * y[1] * (1 - Math.abs(y[1])) + 3 * y[0],
      4 * y[0] * (1 - Math.abs(y[0])) + 5 * y[1],
    ]);
  });

  it("nonlinearDiffEq3 models the three-person chaotic system", () => {
    const diffEq = nonlinearVisData[1].diffEqs[0](2, 1, 3, 4, 6, 5);
    const y: [number, number, number, number] = [0.5, 0.3, 0.2, 0.1];
    const [a, b, c, d, f, e] = [1, 2, 3, 4, 6, 5];
    expect(diffEq(0, y)).toEqual([
      a * y[0] + b * y[1] * (1 - Math.abs(y[1])),
      c * (y[0] - y[3]) * (1 - Math.abs(y[0] - y[3])) + d * y[1],
      c * (y[3] - y[0]) * (1 - Math.abs(y[3] - y[0])) + d * y[2],
      e * y[3] + f * y[2] * (1 - Math.abs(y[2])),
    ]);
  });
});
