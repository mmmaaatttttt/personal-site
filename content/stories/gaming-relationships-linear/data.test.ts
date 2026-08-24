import { describe, expect, it } from "vitest";
import { linearVisData } from "./data";

describe("linearVisData diffEqs", () => {
  it("graph1's diffEq: A' = a*B(t), B' = b*A(t)", () => {
    const diffEq = linearVisData[0].diffEqs[0](2, 3);
    expect(diffEq(0, [5, 7])).toEqual([2 * 7, 3 * 5]);
  });

  it("graph2's diffEq: A' = a*B + b*A, B' = c*A + d*B", () => {
    const diffEq = linearVisData[1].diffEqs[0](2, 3, 4, 5);
    expect(diffEq(0, [5, 7])).toEqual([2 * 7 + 3 * 5, 4 * 5 + 5 * 7]);
  });

  it("graph3's diffEq: A' = a*B + b*A + d*g, B' = e*A + f*B + h*c", () => {
    const diffEq = linearVisData[2].diffEqs[0](1, 2, 3, 4, 5, 6, 7, 8);
    expect(diffEq(0, [5, 7])).toEqual([
      1 * 7 + 2 * 5 + 4 * 7,
      5 * 5 + 6 * 7 + 8 * 3,
    ]);
  });
});
