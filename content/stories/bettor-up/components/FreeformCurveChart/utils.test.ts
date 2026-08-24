import { scaleLinear } from "d3-scale";
import type { PointerEvent } from "react";
import { describe, expect, it } from "vitest";
import {
  bucketsToFunction,
  bucketsToPoints,
  createInitialBuckets,
  numericalDerivative,
  paintSegment,
  toDomainCoords,
} from "./utils";

const xScale = scaleLinear().domain([0, 1]).range([0, 100]);
const yScale = scaleLinear().domain([0, 1]).range([0, 100]);

function makeEvent(
  clientX: number,
  clientY: number,
  options: { noSvg?: boolean; noCtm?: boolean } = {},
): PointerEvent<SVGRectElement> {
  const svg = {
    getScreenCTM: vi
      .fn()
      .mockReturnValue(options.noCtm ? null : { a: 1, d: 1, e: 0, f: 0 }),
  } as unknown as SVGSVGElement;

  return {
    clientX,
    clientY,
    currentTarget: {
      ownerSVGElement: options.noSvg ? null : svg,
    },
  } as unknown as PointerEvent<SVGRectElement>;
}

describe("createInitialBuckets", () => {
  it("builds a flat line at 0.5, not the diagonal", () => {
    const buckets = createInitialBuckets(4);
    expect(buckets).toEqual([0.5, 0.5, 0.5, 0.5, 0.5]);
  });
});

describe("paintSegment", () => {
  it("writes a single bucket when from and to land on the same index", () => {
    const buckets = createInitialBuckets(4);
    const next = paintSegment(buckets, 4, 0.5, 0.5, 0.51, 0.9);
    expect(next[2]).toBe(0.9);
    expect(next).not.toBe(buckets);
  });

  it("interpolates forward across a range of buckets", () => {
    const buckets = createInitialBuckets(4);
    const next = paintSegment(buckets, 4, 0, 0, 1, 1);
    expect(next).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it("interpolates backward when the drag direction reverses", () => {
    const buckets = createInitialBuckets(4);
    const next = paintSegment(buckets, 4, 1, 1, 0, 0);
    expect(next).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it("clamps painted values to [0, 1]", () => {
    const buckets = createInitialBuckets(2);
    const next = paintSegment(buckets, 2, 0, 1.5, 1, -0.5);
    expect(next[0]).toBe(1);
    expect(next[2]).toBe(0);
  });

  it("skips indices outside the bucket range but keeps interpolating along the true line", () => {
    const buckets = createInitialBuckets(4);
    const next = paintSegment(buckets, 4, -0.5, 0, 1.5, 1);
    expect(next).toEqual([0.25, 0.375, 0.5, 0.625, 0.75]);
  });
});

describe("bucketsToPoints", () => {
  it("pairs each bucket with its probability value", () => {
    const buckets = [0, 0.5, 1];
    expect(bucketsToPoints(buckets, 2)).toEqual([
      { x: 0, y: 0 },
      { x: 0.5, y: 0.5 },
      { x: 1, y: 1 },
    ]);
  });
});

describe("bucketsToFunction", () => {
  it("returns exact bucket values at grid points", () => {
    const buckets = [0, 0.8, 1];
    const map = bucketsToFunction(buckets, 2);
    expect(map(0)).toBe(0);
    expect(map(0.5)).toBe(0.8);
    expect(map(1)).toBe(1);
  });

  it("interpolates linearly between buckets", () => {
    const buckets = [0, 1];
    const map = bucketsToFunction(buckets, 1);
    expect(map(0.25)).toBeCloseTo(0.25, 5);
    expect(map(0.75)).toBeCloseTo(0.75, 5);
  });

  it("clamps probability outside [0, 1]", () => {
    const buckets = [0, 1];
    const map = bucketsToFunction(buckets, 1);
    expect(map(-1)).toBe(0);
    expect(map(2)).toBe(1);
  });
});

describe("numericalDerivative", () => {
  it("approximates the derivative of probability^2 at an interior point", () => {
    const map = (probability: number) => probability * probability;
    expect(numericalDerivative(map, 0.5)).toBeCloseTo(1, 2);
  });

  it("stays well-defined at the domain boundaries", () => {
    const map = (probability: number) => probability * probability;
    expect(numericalDerivative(map, 0)).toBeCloseTo(0.001, 2);
    expect(numericalDerivative(map, 1)).toBeCloseTo(2, 2);
  });
});

describe("toDomainCoords", () => {
  it("converts a point inside the domain", () => {
    const coords = toDomainCoords(makeEvent(50, 25), xScale, yScale);
    expect(coords).toEqual({ x: 0.5, y: 0.25 });
  });

  it("returns null when x falls outside [0, 1]", () => {
    expect(toDomainCoords(makeEvent(150, 25), xScale, yScale)).toBeNull();
    expect(toDomainCoords(makeEvent(-10, 25), xScale, yScale)).toBeNull();
  });

  it("returns null when y falls outside [0, 1]", () => {
    expect(toDomainCoords(makeEvent(50, 150), xScale, yScale)).toBeNull();
    expect(toDomainCoords(makeEvent(50, -10), xScale, yScale)).toBeNull();
  });

  it("returns null when there is no owning SVG element", () => {
    const coords = toDomainCoords(
      makeEvent(50, 25, { noSvg: true }),
      xScale,
      yScale,
    );
    expect(coords).toBeNull();
  });

  it("returns null when getScreenCTM is unavailable", () => {
    const coords = toDomainCoords(
      makeEvent(50, 25, { noCtm: true }),
      xScale,
      yScale,
    );
    expect(coords).toBeNull();
  });
});
