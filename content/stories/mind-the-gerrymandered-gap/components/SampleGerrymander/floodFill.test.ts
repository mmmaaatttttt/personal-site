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
    for (const d of districts) expect(d).toHaveLength(COL);
  });

  it("returns colCount regions of rowCount cells each when all vertical dividers are on", () => {
    const segments = allVerticalSegments(ROW, COL);
    const districts = countRegions(segments, ROW, COL);
    expect(districts).toHaveLength(COL);
    for (const d of districts) expect(d).toHaveLength(ROW);
  });

  it("returns rowCount * colCount single-cell regions when all dividers are on", () => {
    const segments = Array.from({ length: ROW * 2 - 1 }, (_, i) =>
      i % 2 === 0 ? Array(COL - 1).fill(true) : Array(COL).fill(true),
    );
    const districts = countRegions(segments, ROW, COL);
    expect(districts).toHaveLength(ROW * COL);
    for (const d of districts) expect(d).toHaveLength(1);
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

  it("expands upward when a district can only be reached from below (U-shape)", () => {
    // 2 rows x 3 cols. District A wraps under isolated cell B:
    //   A B A
    //   A A A
    // (0,2) is only reachable by moving up from (1,2).
    const segments = [
      [true, true],
      [false, true, false],
      [false, false],
    ];
    const districts = countRegions(segments, 2, 3);
    expect(districts).toHaveLength(2);
    const sizes = districts.map((d) => d.length).sort((a, b) => a - b);
    expect(sizes).toEqual([1, 5]);
  });

  it("expands leftward when a district can only be reached from the right (U-shape)", () => {
    // 3 rows x 2 cols. District A wraps under isolated cell B, with the
    // direct (1,0)-(2,0) link walled off so (2,0) is only reachable by
    // moving left from (2,1):
    //   A B
    //   A A
    //   A A
    const segments = [[true], [false, true], [false], [true, false], [false]];
    const districts = countRegions(segments, 3, 2);
    expect(districts).toHaveLength(2);
    const sizes = districts.map((d) => d.length).sort((a, b) => a - b);
    expect(sizes).toEqual([1, 5]);
  });
});
