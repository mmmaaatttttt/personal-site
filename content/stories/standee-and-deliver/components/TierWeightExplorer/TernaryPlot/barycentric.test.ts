import { describe, expect, it } from "vitest";
import { pointToWeights, weightsToPoint } from "./barycentric";
import { MIN_TIER_WEIGHT, SNAP_RADIUS } from "./constants";

// Scaled to match the real triangle's order of magnitude so SNAP_RADIUS
// behaves the same as it does in production.
const BLACK_VERTEX = { x: 0, y: 0 };
const SILVER_VERTEX = { x: 200, y: 0 };
const GOLD_VERTEX = { x: 0, y: 200 };
const CENTROID = { x: 200 / 3, y: 200 / 3 };
const EVEN_SPLIT = { black: 1 / 3, silver: 1 / 3, gold: 1 / 3 };
const OTHER_TARGET = { black: 0.5, silver: 0.3, gold: 0.2 };

describe("weightsToPoint", () => {
  it("maps a pure-black weight to the black vertex", () => {
    const point = weightsToPoint(
      { black: 1, silver: 0, gold: 0 },
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    expect(point).toEqual({ x: 0, y: 0 });
  });

  it("maps a pure-silver weight to the silver vertex", () => {
    const point = weightsToPoint(
      { black: 0, silver: 1, gold: 0 },
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    expect(point).toEqual({ x: 200, y: 0 });
  });

  it("maps a pure-gold weight to the gold vertex", () => {
    const point = weightsToPoint(
      { black: 0, silver: 0, gold: 1 },
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    expect(point).toEqual({ x: 0, y: 200 });
  });

  it("maps an even split to the centroid", () => {
    const point = weightsToPoint(
      EVEN_SPLIT,
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    expect(point.x).toBeCloseTo(CENTROID.x);
    expect(point.y).toBeCloseTo(CENTROID.y);
  });
});

describe("pointToWeights", () => {
  it("floors the other two tiers at the black vertex instead of zeroing them", () => {
    const weights = pointToWeights(
      BLACK_VERTEX,
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    expect(weights.black).toBeLessThan(1);
    expect(weights.silver).toBeGreaterThan(0);
    expect(weights.gold).toBeGreaterThan(0);
    expect(weights.black + weights.silver + weights.gold).toBeCloseTo(1);
  });

  it("recovers an even split at the centroid", () => {
    const weights = pointToWeights(
      CENTROID,
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    expect(weights.black).toBeCloseTo(1 / 3);
    expect(weights.silver).toBeCloseTo(1 / 3);
    expect(weights.gold).toBeCloseTo(1 / 3);
  });

  it("does not snap anywhere when no snap targets are given", () => {
    const weights = pointToWeights(
      CENTROID,
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    expect(weights).not.toEqual(EVEN_SPLIT);
  });

  it("snaps to a target just inside the capture radius", () => {
    const justInside = SNAP_RADIUS - 0.1;
    const weights = pointToWeights(
      { x: CENTROID.x + justInside, y: CENTROID.y },
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
      [EVEN_SPLIT],
    );
    expect(weights).toEqual(EVEN_SPLIT);
  });

  it("does not snap once just outside the capture radius", () => {
    const justOutside = SNAP_RADIUS + 0.1;
    const weights = pointToWeights(
      { x: CENTROID.x + justOutside, y: CENTROID.y },
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
      [EVEN_SPLIT],
    );
    expect(weights.black).not.toBe(1 / 3);
    expect(weights.silver).not.toBe(1 / 3);
  });

  it("snaps to whichever of several targets is nearby", () => {
    const otherPoint = weightsToPoint(
      OTHER_TARGET,
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    const weights = pointToWeights(
      otherPoint,
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
      [EVEN_SPLIT, OTHER_TARGET],
    );
    expect(weights).toEqual(OTHER_TARGET);
  });

  it("clamps a point dragged outside the triangle back onto the simplex", () => {
    const weights = pointToWeights(
      { x: 1000, y: 1000 },
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    expect(weights.black).toBeGreaterThan(0);
    expect(weights.silver).toBeGreaterThan(0);
    expect(weights.gold).toBeGreaterThan(0);
    expect(weights.black + weights.silver + weights.gold).toBeCloseTo(1);
  });

  it("stops responding to further movement once already outside an edge", () => {
    const nearby = pointToWeights(
      { x: 100, y: -50 },
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    const farAway = pointToWeights(
      { x: 100, y: -500 },
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    expect(farAway).toEqual(nearby);
  });

  it("projects onto the middle of an edge rather than snapping to a vertex", () => {
    const weights = pointToWeights(
      { x: 100, y: -50 },
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    expect(weights.black).toBeCloseTo(weights.silver);
    expect(weights.gold).toBeCloseTo(MIN_TIER_WEIGHT);
  });

  it("round-trips a point back to its original weights", () => {
    const original = { black: 0.05, silver: 0.9, gold: 0.05 };
    const point = weightsToPoint(
      original,
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    const roundTripped = pointToWeights(
      point,
      BLACK_VERTEX,
      SILVER_VERTEX,
      GOLD_VERTEX,
    );
    expect(roundTripped.black).toBeCloseTo(original.black);
    expect(roundTripped.silver).toBeCloseTo(original.silver);
    expect(roundTripped.gold).toBeCloseTo(original.gold);
  });
});
