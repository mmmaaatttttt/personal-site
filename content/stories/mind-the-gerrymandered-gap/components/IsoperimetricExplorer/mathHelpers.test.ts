import { describe, expect, it } from "vitest";
import {
  generatePoints,
  getAreaInfo,
  getCircleParams,
  getPerimeter,
} from "./mathHelpers";

const W = 600;
const H = 400;

describe("generatePoints", () => {
  it("returns the correct number of points", () => {
    expect(generatePoints(3, 3, W, H)).toHaveLength(3);
    expect(generatePoints(6, 3, W, H)).toHaveLength(6);
    expect(generatePoints(20, 3, W, H)).toHaveLength(20);
  });

  it("centers the polygon in the SVG", () => {
    const pts = generatePoints(4, 3, W, H);
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    expect(cx).toBeCloseTo(W / 2, 5);
    expect(cy).toBeCloseTo(H / 2, 5);
  });

  it("first vertex is at the top (angle = -π/2)", () => {
    const pts = generatePoints(4, 4, W, H);
    // For a square, vertex 0 should be directly above center
    expect(pts[0].x).toBeCloseTo(W / 2, 5);
    expect(pts[0].y).toBeLessThan(H / 2);
  });

  it("produces the same perimeter regardless of side count (constant area normalization)", () => {
    // The distance formula is designed so the corresponding circle area is constant.
    // That means perimeter = 2π·r is also constant across polygon counts.
    const perim3 = getPerimeter(generatePoints(3, 3, W, H));
    const perim6 = getPerimeter(generatePoints(6, 3, W, H));
    const perim12 = getPerimeter(generatePoints(12, 3, W, H));
    expect(perim3).toBeCloseTo(perim6, 0);
    expect(perim6).toBeCloseTo(perim12, 0);
  });
});

describe("getPerimeter", () => {
  it("returns 0 for an empty array", () => {
    expect(getPerimeter([])).toBe(0);
  });

  it("correctly computes the perimeter of a unit square", () => {
    const square = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ];
    expect(getPerimeter(square)).toBeCloseTo(4, 10);
  });

  it("correctly computes the perimeter of a right triangle", () => {
    const triangle = [
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 0, y: 4 },
    ];
    // sides: 3, 4, 5
    expect(getPerimeter(triangle)).toBeCloseTo(12, 10);
  });
});

describe("getCircleParams", () => {
  it("returns the centroid as center", () => {
    const square = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ];
    const { x, y } = getCircleParams(square);
    expect(x).toBeCloseTo(1, 10);
    expect(y).toBeCloseTo(1, 10);
  });

  it("sets r = perimeter / (2π)", () => {
    const pts = generatePoints(8, 3, W, H);
    const perimeter = getPerimeter(pts);
    const { r } = getCircleParams(pts);
    expect(r).toBeCloseTo(perimeter / (2 * Math.PI), 10);
  });
});

describe("getAreaInfo", () => {
  it("ratio is 1 when polygon is also a circle (degenerate: single point)", () => {
    // A polygon with many sides approaches a circle, so ratio → 1.
    // Use a 1000-gon as a proxy.
    const pts = generatePoints(1000, 3, W, H);
    const { r } = getCircleParams(pts);
    const baseArea = Math.PI * r ** 2;
    const { ratio } = getAreaInfo(pts, r, baseArea);
    expect(parseFloat(ratio)).toBeCloseTo(1, 1);
  });

  it("ratio is less than 1 for a triangle", () => {
    const pts = generatePoints(3, 3, W, H);
    const { r } = getCircleParams(pts);
    const baseArea = Math.PI * r ** 2;
    const { ratio } = getAreaInfo(pts, r, baseArea);
    expect(parseFloat(ratio)).toBeLessThan(1);
  });

  it("normalized circle area equals 100 when baseArea = circleArea", () => {
    const pts = generatePoints(6, 3, W, H);
    const { r } = getCircleParams(pts);
    const baseArea = Math.PI * r ** 2;
    const { circleArea } = getAreaInfo(pts, r, baseArea);
    expect(parseFloat(circleArea)).toBeCloseTo(100, 5);
  });

  it("returns string values with two decimal places", () => {
    const pts = generatePoints(4, 3, W, H);
    const { r } = getCircleParams(pts);
    const baseArea = Math.PI * r ** 2;
    const { circleArea, polygonArea, ratio } = getAreaInfo(pts, r, baseArea);
    expect(circleArea).toMatch(/^\d+\.\d{2}$/);
    expect(polygonArea).toMatch(/^\d+\.\d{2}$/);
    expect(ratio).toMatch(/^\d+\.\d{2}$/);
  });

  it("polygon area is less than circle area for all regular polygons", () => {
    for (const n of [3, 4, 5, 6, 8, 10]) {
      const pts = generatePoints(n, 3, W, H);
      const { r } = getCircleParams(pts);
      const baseArea = Math.PI * r ** 2;
      const { circleArea, polygonArea } = getAreaInfo(pts, r, baseArea);
      expect(parseFloat(polygonArea)).toBeLessThan(parseFloat(circleArea));
    }
  });
});
