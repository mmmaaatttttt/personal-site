import { describe, it, expect } from "vitest";
import { generateCirclePoints } from "./helpers";

describe("generateCirclePoints", () => {
  it("returns 4 points for radius 1", () => {
    const pts = generateCirclePoints(1);
    expect(pts).toHaveLength(4);
    expect(pts).toContainEqual({ x: 1, y: 0 });
    expect(pts).toContainEqual({ x: 0, y: 1 });
    expect(pts).toContainEqual({ x: -1, y: 0 });
    expect(pts).toContainEqual({ x: 0, y: -1 });
  });

  it("returns 4*r points for radius r", () => {
    for (const r of [1, 2, 5, 10]) {
      expect(generateCirclePoints(r)).toHaveLength(4 * r);
    }
  });

  it("all points satisfy manhattan distance === radius", () => {
    const r = 7;
    const pts = generateCirclePoints(r);
    for (const { x, y } of pts) {
      expect(Math.abs(x) + Math.abs(y)).toBe(r);
    }
  });

  it("returns no duplicate points", () => {
    const pts = generateCirclePoints(4);
    const keys = pts.map(({ x, y }) => `${x}|${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
