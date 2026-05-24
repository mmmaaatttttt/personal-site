import { describe, expect, it } from "vitest";
import { generatePAdicPoints, getStartIdx, showLabel } from "./helpers";

describe("generatePAdicPoints", () => {
  it("returns p points at level 1", () => {
    expect(generatePAdicPoints(3, 1)).toHaveLength(3);
    expect(generatePAdicPoints(5, 1)).toHaveLength(5);
    expect(generatePAdicPoints(7, 1)).toHaveLength(7);
  });

  it("returns p^2 points at level 2", () => {
    expect(generatePAdicPoints(3, 2)).toHaveLength(9);
    expect(generatePAdicPoints(5, 2)).toHaveLength(25);
  });

  it("returns p^3 points at level 3", () => {
    expect(generatePAdicPoints(3, 3)).toHaveLength(27);
  });

  it("all level-1 points have fillIdx 0", () => {
    const pts = generatePAdicPoints(3, 1);
    for (const p of pts) expect(p.fillIdx).toBe(0);
  });

  it("level-2 points 3..8 have fillIdx 1 for p=3", () => {
    const pts = generatePAdicPoints(3, 2);
    for (let i = 3; i < 9; i++) {
      expect(pts[i].fillIdx).toBe(1);
    }
  });

  it("level-1 points lie on the unit circle", () => {
    const pts = generatePAdicPoints(5, 1);
    pts.forEach(({ cx, cy }) => {
      expect(cx ** 2 + cy ** 2).toBeCloseTo(1);
    });
  });

  it("each point has the correct num field", () => {
    const pts = generatePAdicPoints(3, 2);
    pts.forEach((p, i) => {
      expect(p.num).toBe(i);
    });
  });
});

describe("getStartIdx", () => {
  it("returns 0 for point 0", () => {
    const pts = generatePAdicPoints(3, 2);
    expect(getStartIdx(0, 3, pts)).toBe(0);
  });

  it("returns a valid index within bounds", () => {
    const pts = generatePAdicPoints(3, 2);
    for (let i = 0; i < pts.length; i++) {
      const idx = getStartIdx(i, 3, pts);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(pts.length);
    }
  });
});

describe("showLabel", () => {
  it("shows labels for all points at level 1", () => {
    [3, 5, 7].forEach((prime) => {
      for (let i = 0; i < prime; i++) {
        expect(showLabel(prime, 1, i)).toBe(true);
      }
    });
  });

  it("shows labels at level 3 only for prime=3", () => {
    expect(showLabel(3, 3, 0)).toBe(true);
    expect(showLabel(5, 3, 0)).toBe(false);
    expect(showLabel(7, 3, 0)).toBe(false);
  });

  it("shows labels for num < p^level", () => {
    // level=2, prime=3: show for num < 9
    expect(showLabel(3, 2, 8)).toBe(true);
    expect(showLabel(3, 2, 9)).toBe(false);
  });
});
