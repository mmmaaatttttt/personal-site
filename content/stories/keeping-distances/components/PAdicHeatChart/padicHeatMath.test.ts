import { describe, it, expect } from "vitest";
import { generateGrid } from "./padicHeatMath";

describe("generateGrid", () => {
  it("returns a size×size 2D array", () => {
    const g = generateGrid(3, 2);
    expect(g.length).toBe(3);
    expect(g[0].length).toBe(3);
  });

  it("returns null above the diagonal (yIdx < xIdx)", () => {
    const g = generateGrid(3, 2);
    // g[yIdx][xIdx]: null when yIdx < xIdx
    expect(g[0][1]).toBeNull(); // y=0, x=1
    expect(g[0][2]).toBeNull(); // y=0, x=2
    expect(g[1][2]).toBeNull(); // y=1, x=2
  });

  it("returns a number on and below the diagonal", () => {
    const g = generateGrid(3, 2);
    expect(g[0][0]).not.toBeNull();
    expect(g[1][0]).not.toBeNull();
    expect(g[2][1]).not.toBeNull();
  });

  it("diagonal cells return 1 (pAdicNorm(0, p) quirk)", () => {
    const g = generateGrid(4, 3);
    for (let i = 0; i < 4; i++) {
      expect(g[i][i]).toBe(1);
    }
  });

  it("computes correct p-adic norm for off-diagonal cells", () => {
    // g[2][0] = pAdicNorm(0 - 2, 2) = pAdicNorm(-2, 2) = 2^(-1) = 0.5
    const g = generateGrid(5, 2);
    expect(g[2][0]).toBeCloseTo(0.5);
    // g[4][0] = pAdicNorm(0 - 4, 2) = pAdicNorm(-4, 2) = 2^(-2) = 0.25
    expect(g[4][0]).toBeCloseTo(0.25);
    // g[3][1] = pAdicNorm(1 - 3, 2) = pAdicNorm(-2, 2) = 0.5
    expect(g[3][1]).toBeCloseTo(0.5);
  });

  it("works for prime 3", () => {
    // g[3][0] = pAdicNorm(-3, 3) = 3^(-1) = 1/3
    const g = generateGrid(5, 3);
    expect(g[3][0]).toBeCloseTo(1 / 3);
    // g[1][0] = pAdicNorm(-1, 3) = 3^0 = 1
    expect(g[1][0]).toBeCloseTo(1);
  });
});
