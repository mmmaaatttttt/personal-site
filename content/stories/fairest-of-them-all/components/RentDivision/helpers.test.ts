import { describe, expect, it } from "vitest";
import { generateAllPoints, generateFreqMap, mixColors } from "./helpers";

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

describe("generateFreqMap", () => {
  it("counts occurrences correctly", () => {
    const map = generateFreqMap(["a", "b", "a", "c", "b", "a"]);
    expect(map.get("a")).toBe(3);
    expect(map.get("b")).toBe(2);
    expect(map.get("c")).toBe(1);
  });

  it("returns an empty map for an empty array", () => {
    expect(generateFreqMap([]).size).toBe(0);
  });

  it("handles a single-element array", () => {
    const map = generateFreqMap(["x"]);
    expect(map.get("x")).toBe(1);
    expect(map.size).toBe(1);
  });

  it("works with non-string types", () => {
    const map = generateFreqMap([1, 2, 1, 3, 2, 1]);
    expect(map.get(1)).toBe(3);
    expect(map.get(2)).toBe(2);
    expect(map.get(3)).toBe(1);
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
