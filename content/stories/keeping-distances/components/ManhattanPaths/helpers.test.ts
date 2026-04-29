import { describe, it, expect } from "vitest";
import { scaleLinear } from "d3-scale";
import { generatePathOptions, generatePathPoints, generateGridPoints } from "./helpers";

describe("generatePathOptions", () => {
  it("returns one empty path when height and width are both 0", () => {
    expect(generatePathOptions(0, 0)).toEqual([""]);
  });

  it("returns one all-x path when height is 0", () => {
    expect(generatePathOptions(0, 3)).toEqual(["xxx"]);
  });

  it("returns one all-y path when width is 0", () => {
    expect(generatePathOptions(3, 0)).toEqual(["yyy"]);
  });

  it("returns C(h+w, w) paths — binomial count", () => {
    // C(4, 2) = 6
    expect(generatePathOptions(2, 2)).toHaveLength(6);
    // C(5, 2) = 10
    expect(generatePathOptions(2, 3)).toHaveLength(10);
    // C(3, 1) = 3
    expect(generatePathOptions(1, 2)).toHaveLength(3);
  });

  it("every path has the correct total length", () => {
    const h = 2;
    const w = 3;
    const paths = generatePathOptions(h, w);
    for (const p of paths) {
      expect(p).toHaveLength(h + w);
    }
  });

  it("every path uses only 'x' and 'y' characters", () => {
    for (const p of generatePathOptions(3, 3)) {
      expect(p).toMatch(/^[xy]+$/);
    }
  });

  it("returns unique paths", () => {
    const paths = generatePathOptions(3, 3);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe("generatePathPoints", () => {
  it("returns a single origin point for an empty path", () => {
    expect(generatePathPoints("")).toEqual([{ x: 0, y: 0 }]);
  });

  it("increments x for 'x' moves and y for 'y' moves", () => {
    expect(generatePathPoints("xy")).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it("returns length equal to path string length + 1", () => {
    expect(generatePathPoints("xxyy")).toHaveLength(5);
  });

  it("ends at the correct destination", () => {
    const pts = generatePathPoints("xxy");
    const last = pts[pts.length - 1];
    expect(last).toEqual({ x: 2, y: 1 });
  });
});

describe("generateGridPoints", () => {
  it("excludes the origin", () => {
    const xScale = scaleLinear().domain([0, 5]).range([0, 100]);
    const yScale = scaleLinear().domain([0, 5]).range([100, 0]);
    const pts = generateGridPoints(xScale, yScale);
    expect(pts.find((p) => p.x === 0 && p.y === 0)).toBeUndefined();
  });

  it("returns (xLen * yLen - 1) points", () => {
    // domain [0,5] → 6 values in each direction → 36 - 1 = 35
    const xScale = scaleLinear().domain([0, 5]).range([0, 100]);
    const yScale = scaleLinear().domain([0, 5]).range([100, 0]);
    expect(generateGridPoints(xScale, yScale)).toHaveLength(35);
  });

  it("all x values are within the domain", () => {
    const xScale = scaleLinear().domain([0, 4]).range([0, 100]);
    const yScale = scaleLinear().domain([0, 4]).range([100, 0]);
    const pts = generateGridPoints(xScale, yScale);
    for (const { x } of pts) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(4);
    }
  });
});
