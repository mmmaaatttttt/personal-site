import { describe, expect, it } from "vitest";
import {
  areaHelper,
  areaUnderLine,
  clamped,
  l1Norm,
  lInfNormEndpoints,
  yOnLine,
} from "./helpers";

describe("clamped", () => {
  it("leaves points that are within bounds unchanged", () => {
    const pts = [{ x: 2, y: 3 }];
    expect(clamped(pts, [0, 5], [0, 5])).toEqual([{ x: 2, y: 3 }]);
  });

  it("clamps x to the domain", () => {
    expect(clamped([{ x: -1, y: 2 }], [0, 5], [0, 5])).toEqual([
      { x: 0, y: 2 },
    ]);
    expect(clamped([{ x: 10, y: 2 }], [0, 5], [0, 5])).toEqual([
      { x: 5, y: 2 },
    ]);
  });

  it("clamps y to the domain", () => {
    expect(clamped([{ x: 2, y: -1 }], [0, 5], [0, 5])).toEqual([
      { x: 2, y: 0 },
    ]);
    expect(clamped([{ x: 2, y: 10 }], [0, 5], [0, 5])).toEqual([
      { x: 2, y: 5 },
    ]);
  });

  it("handles multiple points", () => {
    const pts = [
      { x: -1, y: 3 },
      { x: 3, y: 6 },
    ];
    const result = clamped(pts, [0, 5], [0, 5]);
    expect(result[0]).toEqual({ x: 0, y: 3 });
    expect(result[1]).toEqual({ x: 3, y: 5 });
  });
});

describe("yOnLine", () => {
  it("returns y on a horizontal line", () => {
    expect(yOnLine({ x: 0, y: 2 }, { x: 4, y: 2 }, 2)).toBe(2);
  });

  it("returns y on a sloped line", () => {
    // line from (0,0) to (4,4): y = x
    expect(yOnLine({ x: 0, y: 0 }, { x: 4, y: 4 }, 2)).toBe(2);
  });

  it("handles vertical line (x1 === x2) by returning pt1.y", () => {
    expect(yOnLine({ x: 3, y: 1 }, { x: 3, y: 5 }, 3)).toBe(1);
  });
});

describe("areaUnderLine", () => {
  it("returns 0 for points with the same x", () => {
    expect(areaUnderLine({ x: 2, y: 1 }, { x: 2, y: 3 })).toBe(0);
  });

  it("computes trapezoid area correctly", () => {
    // width=2, heights 2 and 4 → area = 2*(4+2)/2 = 6
    expect(areaUnderLine({ x: 0, y: 2 }, { x: 2, y: 4 })).toBe(6);
  });

  it("is symmetric (order of points doesn't matter)", () => {
    const a = areaUnderLine({ x: 0, y: 2 }, { x: 2, y: 4 });
    const b = areaUnderLine({ x: 2, y: 4 }, { x: 0, y: 2 });
    expect(a).toBeCloseTo(b);
  });
});

describe("areaHelper", () => {
  it("returns 0 when both segments are identical", () => {
    const seg = [
      { x: 0, y: 2 },
      { x: 4, y: 2 },
    ];
    expect(areaHelper(seg, seg)).toBe(0);
  });

  it("computes area between two parallel horizontal segments", () => {
    const upper = [
      { x: 0, y: 4 },
      { x: 4, y: 4 },
    ];
    const lower = [
      { x: 0, y: 2 },
      { x: 4, y: 2 },
    ];
    // width=4, constant diff=2 → area = 4*2 = 8
    expect(areaHelper(upper, lower)).toBeCloseTo(8);
  });

  it("handles crossing segments by splitting at intersection", () => {
    // f1: (0,0)→(4,4), f2: (0,4)→(4,0) — they cross at (2,2)
    const f1 = [
      { x: 0, y: 0 },
      { x: 4, y: 4 },
    ];
    const f2 = [
      { x: 0, y: 4 },
      { x: 4, y: 0 },
    ];
    // ∫|x - (4-x)| dx on [0,4] = ∫|2x-4| dx = two triangles of area 4 each = 8
    expect(areaHelper(f1, f2)).toBeCloseTo(8);
  });
});

describe("lInfNormEndpoints", () => {
  it("returns the segment with the largest vertical distance", () => {
    // Two flat functions differing by 3 at the endpoints and by 1 in the middle
    const pts1 = [
      { x: 0, y: 0 },
      { x: 50, y: 10 },
      { x: 100, y: 0 },
    ];
    const pts2 = [
      { x: 0, y: 30 }, // diff = 30 here
      { x: 50, y: 11 },
      { x: 100, y: 1 },
    ];
    const seg = lInfNormEndpoints(pts1, pts2);
    expect(Math.abs(seg.y2 - seg.y1)).toBeGreaterThanOrEqual(
      Math.abs(pts2[0].y - pts1[0].y) - 0.01,
    );
  });

  it("is not sensitive to which argument is pts1 vs pts2", () => {
    const a = [
      { x: 0, y: 0 },
      { x: 50, y: 5 },
      { x: 100, y: 0 },
    ];
    const b = [
      { x: 0, y: 3 },
      { x: 50, y: 3 },
      { x: 100, y: 3 },
    ];
    const seg1 = lInfNormEndpoints(a, b);
    const seg2 = lInfNormEndpoints(b, a);
    expect(Math.abs(seg1.y2 - seg1.y1)).toBeCloseTo(
      Math.abs(seg2.y2 - seg2.y1),
    );
  });
});

describe("l1Norm", () => {
  it("returns 0 when both functions are identical", () => {
    const pts = [
      { x: 0, y: 2 },
      { x: 2.5, y: 2 },
      { x: 5, y: 2 },
    ];
    expect(l1Norm(pts, pts)).toBeCloseTo(0);
  });

  it("returns a positive area when functions differ", () => {
    const f1 = [
      { x: 0, y: 4 },
      { x: 2.5, y: 4 },
      { x: 5, y: 4 },
    ];
    const f2 = [
      { x: 0, y: 1 },
      { x: 2.5, y: 1 },
      { x: 5, y: 1 },
    ];
    // constant gap of 3 over width 5 → area = 15
    expect(l1Norm(f1, f2)).toBeCloseTo(15);
  });

  it("is symmetric — l1Norm(a, b) === l1Norm(b, a)", () => {
    const f1 = [
      { x: 0, y: 4 },
      { x: 2, y: 2 },
      { x: 5, y: 4 },
    ];
    const f2 = [
      { x: 0, y: 1 },
      { x: 3, y: 3 },
      { x: 5, y: 1 },
    ];
    expect(l1Norm(f1, f2)).toBeCloseTo(l1Norm(f2, f1));
  });
});
