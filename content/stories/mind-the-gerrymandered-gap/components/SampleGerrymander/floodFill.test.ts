import { describe, expect, it } from "vitest";
import { getInitialSegments } from "./constants";
import { countRegions } from "./floodFill";

const ROW = 6;
const COL = 9;

function allHorizontalSegments(
  rowCount: number,
  colCount: number,
): boolean[][] {
  return Array.from({ length: rowCount * 2 - 1 }, (_, i) =>
    i % 2 === 1 ? Array(colCount).fill(true) : Array(colCount - 1).fill(false),
  );
}

function allVerticalSegments(rowCount: number, colCount: number): boolean[][] {
  return Array.from({ length: rowCount * 2 - 1 }, (_, i) =>
    i % 2 === 0 ? Array(colCount - 1).fill(true) : Array(colCount).fill(false),
  );
}

describe("countRegions", () => {
  it("returns one region covering all cells when no segments are active", () => {
    const segments = getInitialSegments(ROW, COL);
    const districts = countRegions(segments, ROW, COL);
    expect(districts).toHaveLength(1);
    expect(districts[0]).toHaveLength(ROW * COL);
  });

  it("returns rowCount regions of colCount cells each when all horizontal dividers are on", () => {
    const segments = allHorizontalSegments(ROW, COL);
    const districts = countRegions(segments, ROW, COL);
    expect(districts).toHaveLength(ROW);
    districts.forEach((d) => expect(d).toHaveLength(COL));
  });

  it("returns colCount regions of rowCount cells each when all vertical dividers are on", () => {
    const segments = allVerticalSegments(ROW, COL);
    const districts = countRegions(segments, ROW, COL);
    expect(districts).toHaveLength(COL);
    districts.forEach((d) => expect(d).toHaveLength(ROW));
  });

  it("returns rowCount * colCount single-cell regions when all dividers are on", () => {
    const segments = Array.from({ length: ROW * 2 - 1 }, (_, i) =>
      i % 2 === 0 ? Array(COL - 1).fill(true) : Array(COL).fill(true),
    );
    const districts = countRegions(segments, ROW, COL);
    expect(districts).toHaveLength(ROW * COL);
    districts.forEach((d) => expect(d).toHaveLength(1));
  });

  it("each cell appears in exactly one district", () => {
    const segments = allHorizontalSegments(ROW, COL);
    const districts = countRegions(segments, ROW, COL);
    const seen = new Set<string>();
    for (const district of districts) {
      for (const [r, c] of district) {
        const key = `${r},${c}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    }
    expect(seen.size).toBe(ROW * COL);
  });

  it("a single activated segment splits one region into two", () => {
    const segments = getInitialSegments(2, 2);
    // Activate the horizontal divider between rows 0 and 1 at column 0
    // segments[1] is the odd row (horizontal), segments[1][0] = true
    segments[1][0] = true;
    segments[1][1] = true;
    const districts = countRegions(segments, 2, 2);
    expect(districts).toHaveLength(2);
    expect(districts[0]).toHaveLength(2);
    expect(districts[1]).toHaveLength(2);
  });

  it("works for a 1×1 grid", () => {
    const segments = getInitialSegments(1, 1);
    const districts = countRegions(segments, 1, 1);
    expect(districts).toHaveLength(1);
    expect(districts[0]).toEqual([[0, 0]]);
  });
});
