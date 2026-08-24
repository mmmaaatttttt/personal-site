import { describe, expect, it } from "vitest";
import { alphaCO, alphaNE } from "../dailemma/math";
import {
  coalitionAutomationRate,
  computeYExtent,
  effectiveMarketSize,
  nashRateWithAutomationTax,
  nashRateWithWorkerEquity,
  optimalAutomationTax,
  padYDomain,
} from "./math";

describe("computeYExtent", () => {
  it("returns the plain min/max when no anchors are given", () => {
    expect(computeYExtent([3, -2, 5])).toEqual({ yMin: -2, yMax: 5 });
  });

  it("forces an anchor into the min side only when given there", () => {
    expect(computeYExtent([1, 2, 3], [0])).toEqual({ yMin: 0, yMax: 3 });
  });

  it("forces an anchor into the max side only when given there", () => {
    expect(computeYExtent([0.2, 0.5], [], [1])).toEqual({
      yMin: 0.2,
      yMax: 1,
    });
  });

  it("leaves an anchor with no effect when the data already exceeds it", () => {
    expect(computeYExtent([-5, 10], [0], [0])).toEqual({ yMin: -5, yMax: 10 });
  });

  it("applies independent anchors on both sides at once", () => {
    expect(computeYExtent([0.3, 0.6], [0], [1])).toEqual({
      yMin: 0,
      yMax: 1,
    });
  });
});

describe("padYDomain", () => {
  it("computes padding as a fraction of the domain span", () => {
    expect(padYDomain(0, 10, 0.08)).toBeCloseTo(0.8);
  });

  it("returns 0 for a zero-width domain", () => {
    expect(padYDomain(5, 5, 0.1)).toBe(0);
  });
});

describe("coalitionAutomationRate", () => {
  it("at coalitionSize=1 equals the Nash equilibrium rate", () => {
    const [s, dl, N, k] = [0.7, 0.35, 7, 1];
    expect(coalitionAutomationRate(s, dl, N, k, 1)).toBeCloseTo(
      alphaNE(s, dl, N, k),
    );
  });

  it("at coalitionSize=N equals the cooperative rate", () => {
    const [s, dl, N, k] = [0.7, 0.35, 7, 1];
    expect(coalitionAutomationRate(s, dl, N, k, N)).toBeCloseTo(
      alphaCO(s, dl, k),
    );
  });

  it("is non-increasing as coalition size grows", () => {
    const [s, dl, N, k] = [0.7, 0.35, 7, 1];
    for (let M = 1; M < N; M++) {
      expect(coalitionAutomationRate(s, dl, N, k, M)).toBeGreaterThanOrEqual(
        coalitionAutomationRate(s, dl, N, k, M + 1),
      );
    }
  });

  it("k=0: returns 1 when savings exceed the coalition threshold", () => {
    expect(coalitionAutomationRate(0.5, 0.3, 5, 0, 1)).toBe(1);
  });

  it("k=0: returns 0 when savings fall below the coalition threshold", () => {
    expect(coalitionAutomationRate(0.1, 0.3, 2, 0, 2)).toBe(0);
  });

  it("clamps to 0 when savings are very low", () => {
    expect(coalitionAutomationRate(0.1, 0.9, 2, 1, 2)).toBe(0);
  });

  it("clamps to 1 when savings are very high", () => {
    expect(coalitionAutomationRate(1.0, 0, 5, 0.1, 1)).toBe(1);
  });
});

describe("optimalAutomationTax", () => {
  it("is zero when numFirms=1 (monopolist already internalizes the externality)", () => {
    expect(optimalAutomationTax(0.5, 1)).toBe(0);
  });

  it("approaches demandLoss as numFirms grows large", () => {
    expect(optimalAutomationTax(0.5, 1000)).toBeCloseTo(0.5, 2);
  });

  it("scales linearly with demandLoss", () => {
    expect(optimalAutomationTax(0.4, 5)).toBeCloseTo(
      2 * optimalAutomationTax(0.2, 5),
    );
  });

  it("increases with number of firms", () => {
    expect(optimalAutomationTax(0.5, 10)).toBeGreaterThan(
      optimalAutomationTax(0.5, 5),
    );
  });
});

describe("nashRateWithAutomationTax", () => {
  it("at zero tax equals the standard Nash equilibrium rate", () => {
    const [s, dl, N, k] = [0.7, 0.35, 7, 1];
    expect(nashRateWithAutomationTax(s, dl, N, k, 0)).toBeCloseTo(
      alphaNE(s, dl, N, k),
    );
  });

  it("at the optimal tax equals the cooperative rate", () => {
    const [s, dl, N, k] = [0.7, 0.35, 7, 1];
    const tax = optimalAutomationTax(dl, N);
    expect(nashRateWithAutomationTax(s, dl, N, k, tax)).toBeCloseTo(
      alphaCO(s, dl, k),
    );
  });

  it("decreases as the tax rate increases", () => {
    const [s, dl, N, k] = [0.7, 0.35, 7, 1];
    expect(nashRateWithAutomationTax(s, dl, N, k, 0.1)).toBeGreaterThan(
      nashRateWithAutomationTax(s, dl, N, k, 0.2),
    );
  });

  it("clamps to 0 with a very high tax", () => {
    expect(nashRateWithAutomationTax(0.3, 0.3, 5, 1, 1.0)).toBe(0);
  });

  it("k=0: returns 1 when effective savings exceed the threshold", () => {
    expect(nashRateWithAutomationTax(0.8, 0.2, 5, 0, 0.1)).toBe(1);
  });

  it("k=0: returns 0 when effective savings fall below the threshold", () => {
    expect(nashRateWithAutomationTax(0.3, 0.5, 2, 0, 0.3)).toBe(0);
  });
});

describe("effectiveMarketSize", () => {
  it("equals numFirms when equity share is zero", () => {
    expect(effectiveMarketSize(7, 0, 0.5)).toBe(7);
  });

  it("equals 1 when sectorSpendingFraction=1 and equityShare=1", () => {
    expect(effectiveMarketSize(7, 1, 1)).toBe(1);
  });

  it("decreases as equity share increases", () => {
    expect(effectiveMarketSize(7, 0.5, 0.5)).toBeLessThan(
      effectiveMarketSize(7, 0, 0.5),
    );
  });

  it("decreases as sector spending fraction increases", () => {
    expect(effectiveMarketSize(7, 0.5, 0.8)).toBeLessThan(
      effectiveMarketSize(7, 0.5, 0.4),
    );
  });
});

describe("nashRateWithWorkerEquity", () => {
  it("at zero equity equals the standard Nash rate", () => {
    const [s, dl, N, k] = [0.7, 0.35, 7, 1];
    expect(nashRateWithWorkerEquity(s, dl, N, k, 0, 0.5)).toBeCloseTo(
      alphaNE(s, dl, N, k),
    );
  });

  it("decreases as equity share increases", () => {
    const [s, dl, N, k] = [0.7, 0.35, 7, 1];
    expect(nashRateWithWorkerEquity(s, dl, N, k, 0.2, 0.5)).toBeGreaterThan(
      nashRateWithWorkerEquity(s, dl, N, k, 0.8, 0.5),
    );
  });

  it("does not reach alphaCO for feasible equity when spendingFraction < 1", () => {
    const [s, dl, N, k] = [0.7, 0.35, 7, 1];
    const co = alphaCO(s, dl, k);
    const withMaxEquity = nashRateWithWorkerEquity(s, dl, N, k, 1.0, 0.5);
    expect(withMaxEquity).toBeGreaterThan(co);
  });

  it("k=0: returns 1 when savings exceed the effective threshold", () => {
    expect(nashRateWithWorkerEquity(0.9, 0.2, 5, 0, 0.5, 0.5)).toBe(1);
  });

  it("k=0: returns 0 when savings fall below the effective threshold", () => {
    expect(nashRateWithWorkerEquity(0.01, 0.5, 5, 0, 0, 0.5)).toBe(0);
  });
});
