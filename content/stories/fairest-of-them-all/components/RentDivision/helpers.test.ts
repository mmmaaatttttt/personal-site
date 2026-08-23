import { describe, expect, it } from "vitest";
import COLORS from "@/utils/styles";
import {
  advanceToNext,
  generateAllPoints,
  getNameFromLabel,
  getTooltipBody,
  getTriangleColor,
  mixColors,
  type PointData,
  shouldBeDisabled,
} from "./helpers";

const makePoint = (
  color: string,
  overrides: Partial<PointData> = {},
): PointData => ({
  x: 0,
  y: 0,
  color,
  prices: [0, 0, 0],
  r: 1,
  label: "",
  ...overrides,
});

// Minimal corner set matching the real defaults
const RENT = 1600;
const corners = [
  { x: 300, y: 0, prices: [0, 0, RENT] },
  { x: 0, y: 400, prices: [RENT, 0, 0] },
  { x: 600, y: 400, prices: [0, RENT, 0] },
];
const names = ["Alex", "Brett", "Cameron"];
const initialR = 30;

describe("generateAllPoints", () => {
  it("returns rowCount = 2^(meshLevels-1) + 1 rows", () => {
    const pts2 = generateAllPoints(2, corners, initialR, names);
    expect(pts2.length).toBe(3); // 2^1 + 1

    const pts3 = generateAllPoints(3, corners, initialR, names);
    expect(pts3.length).toBe(5); // 2^2 + 1

    const pts4 = generateAllPoints(4, corners, initialR, names);
    expect(pts4.length).toBe(9); // 2^3 + 1
  });

  it("row i has i+1 points", () => {
    const pts = generateAllPoints(3, corners, initialR, names);
    pts.forEach((row, i) => {
      expect(row.length).toBe(i + 1);
    });
  });

  it("assigns distinct labels A, B, C to the first two rows", () => {
    const pts = generateAllPoints(2, corners, initialR, names);
    expect(pts[0][0].label).toBe("A");
    expect(pts[1][0].label).toBe("B");
    expect(pts[1][1].label).toBe("C");
  });

  it("every small triangle has three distinct labels", () => {
    const pts = generateAllPoints(3, corners, initialR, names);
    for (let y = 0; y < pts.length - 1; y++) {
      for (let x = 0; x < pts[y].length; x++) {
        // upward triangle: [y][x], [y+1][x], [y+1][x+1]
        const labels = new Set([
          pts[y][x].label,
          pts[y + 1][x].label,
          pts[y + 1][x + 1].label,
        ]);
        expect(labels.size).toBe(3);
      }
    }
  });

  it("corner prices match the input corners", () => {
    const pts = generateAllPoints(2, corners, initialR, names);
    // Top corner
    expect(pts[0][0].prices).toEqual([0, 0, RENT]);
    // Bottom-left corner (last row, first element)
    const lastRow = pts[pts.length - 1];
    expect(lastRow[0].prices).toEqual([RENT, 0, 0]);
    // Bottom-right corner
    expect(lastRow[lastRow.length - 1].prices).toEqual([0, RENT, 0]);
  });

  it("interior point prices sum to RENT", () => {
    const pts = generateAllPoints(3, corners, initialR, names);
    // Middle point of the bottom row should be near [0, RENT/2, RENT/2]
    // All prices should sum to RENT
    pts.forEach((row) => {
      row.forEach((pt) => {
        const sum = pt.prices.reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(RENT, 5);
      });
    });
  });
});

describe("mixColors", () => {
  it("fraction=1 returns color1 exactly", () => {
    expect(mixColors(1, "#ff0000", "#0000ff")).toBe("#ff0000");
  });

  it("fraction=0 returns color2 exactly", () => {
    expect(mixColors(0, "#ff0000", "#0000ff")).toBe("#0000ff");
  });

  it("fraction=0.5 returns the midpoint color", () => {
    // red #ff0000 + blue #0000ff: r=Math.round(0.5*255)=128, g=0, b=128 → #800080
    expect(mixColors(0.5, "#ff0000", "#0000ff")).toBe("#800080");
  });

  it("mixes two gray values proportionally", () => {
    // #ffffff + #000000 at fraction=0.25: Math.round(0.25*255)=64 → #404040
    expect(mixColors(0.25, "#ffffff", "#000000")).toBe("#404040");
  });
});

describe("getNameFromLabel", () => {
  it("finds the name whose first letter matches the label", () => {
    expect(getNameFromLabel(makePoint("x", { label: "B" }), names)).toBe(
      "Brett",
    );
  });
});

describe("getTooltipBody", () => {
  it("formats each price with its room color", () => {
    const point = makePoint("x", { prices: [10, 20.5, 0] });
    expect(getTooltipBody(point, ["Orange", "Green", "Purple"])).toEqual([
      "Orange: $10.00",
      "Green: $20.50",
      "Purple: $0.00",
    ]);
  });
});

describe("shouldBeDisabled", () => {
  it("disables a non-zero price when another room is free", () => {
    expect(shouldBeDisabled([0, 1600, 0], 1)).toBe(true);
  });

  it("does not disable the free room itself", () => {
    expect(shouldBeDisabled([0, 1600, 0], 0)).toBe(false);
  });

  it("does not disable anything when no room is free", () => {
    expect(shouldBeDisabled([500, 600, 500], 0)).toBe(false);
  });
});

describe("getTriangleColor", () => {
  it("returns light gray when any corner is still unassigned (black)", () => {
    const corners = [
      makePoint(COLORS.BLACK),
      makePoint(COLORS.RED),
      makePoint(COLORS.RED),
    ];
    expect(getTriangleColor(corners)).toBe(COLORS.LIGHT_GRAY);
  });

  it("returns the shared color when all three corners match", () => {
    const corners = [
      makePoint(COLORS.GREEN),
      makePoint(COLORS.GREEN),
      makePoint(COLORS.GREEN),
    ];
    expect(getTriangleColor(corners)).toBe(COLORS.GREEN);
  });

  it("returns white when all three corners are distinct colors", () => {
    const corners = [
      makePoint(COLORS.RED),
      makePoint(COLORS.GREEN),
      makePoint(COLORS.DARK_BLUE),
    ];
    expect(getTriangleColor(corners)).toBe(COLORS.WHITE);
  });

  it("blends the two colors weighted by their frequency otherwise", () => {
    const corners = [
      makePoint(COLORS.RED),
      makePoint(COLORS.RED),
      makePoint(COLORS.GREEN),
    ];
    expect(getTriangleColor(corners)).toBe(
      mixColors(2 / 3, COLORS.RED, COLORS.GREEN),
    );
  });
});

describe("advanceToNext", () => {
  it("moves from the apex (row 0) to the first base corner", () => {
    const points = [[makePoint(COLORS.RED)]];
    expect(advanceToNext(points, [0, 0])).toEqual({
      activePtLoc: [1, 0],
      finalCorners: null,
    });
  });

  it("moves from the second row's left point to its right neighbor", () => {
    const points = [
      [makePoint(COLORS.RED)],
      [makePoint(COLORS.GREEN), makePoint(COLORS.BLUE)],
    ];
    expect(advanceToNext(points, [1, 0])).toEqual({
      activePtLoc: [1, 1],
      finalCorners: null,
    });
  });

  it("declares a win when a rainbow triangle forms", () => {
    // point at [2][1]; candidate 0 = [1][0], candidate 1 = [1][1]
    const points: PointData[][] = [];
    points[1] = [];
    points[1][0] = makePoint(COLORS.GREEN);
    points[1][1] = makePoint(COLORS.DARK_BLUE);
    points[2] = [];
    points[2][1] = makePoint(COLORS.RED);

    const result = advanceToNext(points, [2, 1]);
    expect(result.finalCorners).toEqual([
      points[1][0],
      points[1][1],
      points[2][1],
    ]);
  });

  it("advances toward an unassigned neighbor without overwriting an earlier match", () => {
    // point at [2][1]. Candidates in order: [1][0]=BLUE, [1][1]=BLACK,
    // [2][2]=absent, [3][2]=GREEN, [3][1]=BLACK, [2][0]=absent.
    // i=0 (BLUE -> BLACK) sets nextLoc to [1][1]; i=3 (GREEN -> BLACK) would
    // also qualify but must be blocked since nextLoc is already set.
    const points: PointData[][] = [];
    points[1] = [];
    points[1][0] = makePoint(COLORS.BLUE);
    points[1][1] = makePoint(COLORS.BLACK);
    points[2] = [];
    points[2][1] = makePoint(COLORS.RED);
    points[3] = [];
    points[3][1] = makePoint(COLORS.BLACK);
    points[3][2] = makePoint(COLORS.GREEN);

    const result = advanceToNext(points, [2, 1]);
    expect(result).toEqual({ activePtLoc: [1, 1], finalCorners: null });
  });

  it("advances toward an unassigned point from its assigned neighbor", () => {
    // point at [2][1]; candidate 0 = [1][0] = BLACK, candidate 1 = [1][1] = BLUE.
    const points: PointData[][] = [];
    points[1] = [];
    points[1][0] = makePoint(COLORS.BLACK);
    points[1][1] = makePoint(COLORS.BLUE);
    points[2] = [];
    points[2][1] = makePoint(COLORS.RED);

    const result = advanceToNext(points, [2, 1]);
    expect(result).toEqual({ activePtLoc: [1, 0], finalCorners: null });
  });

  it("stays put when no neighbor qualifies", () => {
    const points: PointData[][] = [];
    points[2] = [];
    points[2][1] = makePoint(COLORS.RED);

    const result = advanceToNext(points, [2, 1]);
    expect(result).toEqual({ activePtLoc: [2, 1], finalCorners: null });
  });
});
