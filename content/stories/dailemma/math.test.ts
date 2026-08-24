import { describe, expect, it } from "vitest";
import {
  alphaCO,
  alphaNE,
  linspace,
  ownerProfitChange,
  pdPayoffs,
  workerIncome,
} from "./math";

describe("alphaNE", () => {
  it("matches paper baseline: s=0.7, ell=0.35, N=7, k=1 → 0.65", () => {
    expect(alphaNE(0.7, 0.35, 7, 1)).toBeCloseTo(0.65);
  });

  it("clamps to 0 when s < ell/N", () => {
    expect(alphaNE(0.1, 1.0, 2, 1)).toBe(0);
  });

  it("clamps to 1 for very high cost savings", () => {
    expect(alphaNE(1.0, 0, 5, 0.5)).toBe(1);
  });

  it("returns 1 for k=0 when s > ell/N", () => {
    expect(alphaNE(0.5, 0.6, 2, 0)).toBe(1);
  });

  it("returns 0 for k=0 when s < ell/N", () => {
    expect(alphaNE(0.2, 0.6, 2, 0)).toBe(0);
  });

  it("is non-decreasing in N (more firms → more automation)", () => {
    const s = 0.7;
    const ell = 0.35;
    const k = 1;
    const ne5 = alphaNE(s, ell, 5, k);
    const ne10 = alphaNE(s, ell, 10, k);
    expect(ne10).toBeGreaterThanOrEqual(ne5);
  });
});

describe("alphaCO", () => {
  it("matches paper baseline: s=0.7, ell=0.35, k=1 → 0.35", () => {
    expect(alphaCO(0.7, 0.35, 1)).toBeCloseTo(0.35);
  });

  it("returns 0 when s <= ell", () => {
    expect(alphaCO(0.3, 0.5, 1)).toBe(0);
    expect(alphaCO(0.5, 0.5, 1)).toBe(0);
  });

  it("is independent of N (cooperative outcome ignores competition)", () => {
    const s = 0.7;
    const ell = 0.35;
    const k = 1;
    expect(alphaCO(s, ell, k)).toBe(alphaCO(s, ell, k));
  });
});

describe("alphaNE >= alphaCO (over-automation)", () => {
  it("NE is always at least as large as CO", () => {
    for (const N of [2, 5, 10, 20]) {
      expect(alphaNE(0.7, 0.35, N, 1)).toBeGreaterThanOrEqual(
        alphaCO(0.7, 0.35, 1),
      );
    }
  });
});

describe("ownerProfitChange", () => {
  it("returns 0 at alpha=0", () => {
    expect(ownerProfitChange(0, 0.7, 0.35, 1)).toBe(0);
  });

  it("peaks at alphaCO", () => {
    const s = 0.7;
    const ell = 0.35;
    const k = 1;
    const co = alphaCO(s, ell, k);
    const peak = ownerProfitChange(co, s, ell, k);
    expect(peak).toBeGreaterThan(ownerProfitChange(co - 0.05, s, ell, k));
    expect(peak).toBeGreaterThan(ownerProfitChange(co + 0.05, s, ell, k));
  });

  it("is lower at alphaNE than at alphaCO (over-automation hurts owners)", () => {
    const s = 0.7;
    const ell = 0.35;
    const k = 1;
    const ne = alphaNE(s, ell, 7, k);
    const co = alphaCO(s, ell, k);
    expect(ownerProfitChange(ne, s, ell, k)).toBeLessThan(
      ownerProfitChange(co, s, ell, k),
    );
  });
});

describe("workerIncome", () => {
  it("returns 1 at alpha=0", () => {
    expect(workerIncome(0, 0.3)).toBe(1);
  });

  it("returns eta at alpha=1", () => {
    expect(workerIncome(1, 0.3)).toBeCloseTo(0.3);
  });

  it("is monotonically decreasing in alpha", () => {
    expect(workerIncome(0.5, 0.3)).toBeLessThan(workerIncome(0.3, 0.3));
  });

  it("equals 1 for all alpha when eta=1 (full replacement)", () => {
    expect(workerIncome(0.5, 1)).toBe(1);
    expect(workerIncome(1, 1)).toBe(1);
  });
});

describe("linspace", () => {
  it("generates n evenly-spaced values", () => {
    const result = linspace(0, 1, 5);
    expect(result).toHaveLength(5);
    expect(result[0]).toBe(0);
    expect(result[4]).toBe(1);
    expect(result[2]).toBeCloseTo(0.5);
  });

  it("returns [start] when n=1", () => {
    expect(linspace(5, 10, 1)).toEqual([5]);
  });
});

describe("pdPayoffs", () => {
  it("neitherAutomates is always 0", () => {
    expect(pdPayoffs(0.4, 0.6).neitherAutomates).toBe(0);
  });

  it("bothAutomate is negative in PD regime (s < ell)", () => {
    expect(pdPayoffs(0.4, 0.6).bothAutomate).toBeLessThan(0);
  });

  it("automate is positive when s > ell/2 (dominant strategy)", () => {
    expect(pdPayoffs(0.4, 0.6).automate).toBeGreaterThan(0);
  });

  it("bothAutomate is positive when s > ell (no PD)", () => {
    expect(pdPayoffs(0.8, 0.5).bothAutomate).toBeGreaterThan(0);
  });
});
