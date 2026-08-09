import { describe, expect, it } from "vitest";
import { buildCobwebPath, findFixedPoints } from "./mathUtils";

describe("buildCobwebPath", () => {
  it("builds the alternating vertical/horizontal staircase for the identity map", () => {
    const identity = (probability: number) => probability;
    const path = buildCobwebPath(identity, 0.3, 3);

    expect(path).toHaveLength(1 + 2 * 3);
    expect(path[0]).toEqual({ x: 0.3, y: 0 });
    for (let i = 1; i < path.length; i++) {
      expect(path[i]).toEqual({ x: 0.3, y: 0.3 });
    }
  });

  it("returns only the starting point when steps is 0", () => {
    const path = buildCobwebPath((probability) => probability, 0.6, 0);
    expect(path).toEqual([{ x: 0.6, y: 0 }]);
  });
});

describe("findFixedPoints", () => {
  it("finds a single stable fixed point away from the scan grid", () => {
    const map = (probability: number) => 0.3 + 0.1 * probability;
    const mapDerivative = () => 0.1;

    const fixedPoints = findFixedPoints(map, mapDerivative);

    expect(fixedPoints).toHaveLength(1);
    expect(fixedPoints[0].probability).toBeCloseTo(1 / 3, 3);
    expect(fixedPoints[0].slope).toBeCloseTo(0.1, 5);
    expect(fixedPoints[0].stable).toBe(true);
  });

  it("finds boundary fixed points, one stable and one unstable", () => {
    const map = (probability: number) => probability * probability;
    const mapDerivative = (probability: number) => 2 * probability;

    const fixedPoints = findFixedPoints(map, mapDerivative);

    expect(fixedPoints).toHaveLength(2);
    expect(fixedPoints[0].probability).toBeCloseTo(0, 5);
    expect(fixedPoints[0].stable).toBe(true);
    expect(fixedPoints[1].probability).toBeCloseTo(1, 5);
    expect(fixedPoints[1].stable).toBe(false);
  });

  it("records a grid-aligned interior root directly, without a spurious duplicate next to it", () => {
    // gap(probability) = map(probability) - probability = probability - 0.5,
    // exactly zero at probability = 0.5, which lands on the scan grid. A
    // naive scan would also flag the very next grid point as a second sign
    // change; this must not happen.
    const map = (probability: number) => 2 * probability - 0.5;
    const mapDerivative = () => 2;

    const fixedPoints = findFixedPoints(map, mapDerivative);

    expect(fixedPoints).toHaveLength(1);
    expect(fixedPoints[0].probability).toBe(0.5);
    expect(fixedPoints[0].slope).toBe(2);
    expect(fixedPoints[0].stable).toBe(false);
  });

  it("returns an empty array when there is no fixed point in [0, 1]", () => {
    const fixedPoints = findFixedPoints(
      (probability) => probability + 0.5,
      () => 1,
    );
    expect(fixedPoints).toEqual([]);
  });
});
