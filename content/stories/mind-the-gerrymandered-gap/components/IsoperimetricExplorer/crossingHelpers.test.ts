import { describe, it, expect } from "vitest";
import { crossingExists } from "./crossingHelpers";

const square = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
];

describe("crossingExists", () => {
  it("returns false for a convex square with any vertex moved", () => {
    expect(crossingExists(square, 0)).toBe(false);
    expect(crossingExists(square, 1)).toBe(false);
    expect(crossingExists(square, 2)).toBe(false);
    expect(crossingExists(square, 3)).toBe(false);
  });

  it("returns false for a triangle", () => {
    const triangle = [
      { x: 50, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ];
    expect(crossingExists(triangle, 0)).toBe(false);
  });

  it("returns true when a vertex is moved to create a self-intersection", () => {
    // Move vertex 0 of the square past the right edge: (0,0) → (150,50).
    // The new edge seg3 (0,100)→(150,50) now crosses seg1 (100,0)→(100,100).
    const selfCrossing = [
      { x: 150, y: 50 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ];
    expect(crossingExists(selfCrossing, 0)).toBe(true);
  });

  it("returns true for a classic X-shaped crossing (4 points)", () => {
    // Two diagonals of a square: (0,0)-(100,100) crosses (100,0)-(0,100)
    const crossing = [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { x: 100, y: 0 },
      { x: 0, y: 100 },
    ];
    expect(crossingExists(crossing, 1)).toBe(true);
  });

  it("returns false when points are collinear but not crossing", () => {
    // All on the same line, in order
    const line = [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 100, y: 0 },
      { x: 0, y: 50 },
    ];
    // Adjacent segments share endpoints so they shouldn't count as crossings
    expect(crossingExists(line, 1)).toBe(false);
  });
});
