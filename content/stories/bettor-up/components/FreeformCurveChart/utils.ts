import type { ScaleLinear } from "d3-scale";
import { scaleLinear } from "d3-scale";
import type { PointerEvent } from "react";
import type { Point } from "@/types/geometry";
import { clamp, interpolate } from "@/utils/mathHelpers";

export const RESOLUTION = 200;
const DEFAULT_DERIVATIVE_STEP_SIZE = 0.001;
const INITIAL_VALUE = 0.5;

// Starts flat, not diagonal — the diagonal trivially satisfies the
// fixed-point equation everywhere, which would spuriously "cross" at
// nearly every sampled point.
export function createInitialBuckets(resolution: number): number[] {
  return Array.from({ length: resolution + 1 }, () => INITIAL_VALUE);
}

// Every write overwrites whatever was there, so the result stays
// single-valued regardless of drag direction.
export function paintSegment(
  buckets: number[],
  resolution: number,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): number[] {
  const next = [...buckets];
  const fromIndex = Math.round(fromX * resolution);
  const toIndex = Math.round(toX * resolution);

  if (fromIndex === toIndex) {
    const index = clamp(toIndex, 0, resolution);
    next[index] = clamp(toY, 0, 1);
    return next;
  }

  const step = toIndex > fromIndex ? 1 : -1;
  for (let i = fromIndex; i !== toIndex + step; i += step) {
    if (i < 0 || i > resolution) continue;
    const blendFactor = (i - fromIndex) / (toIndex - fromIndex);
    next[i] = clamp(interpolate(toY, fromY, blendFactor), 0, 1);
  }
  return next;
}

export function bucketsToPoints(
  buckets: number[],
  resolution: number,
): Point[] {
  return buckets.map((y, i) => ({ x: i / resolution, y }));
}

// Delegates to d3-scale's scaleLinear for piecewise interpolation
// instead of hand-rolling it.
export function bucketsToFunction(
  buckets: number[],
  resolution: number,
): (probability: number) => number {
  const domain = buckets.map((_, i) => i / resolution);
  const scale = scaleLinear().domain(domain).range(buckets).clamp(true);
  return (probability: number) => scale(probability);
}

export function numericalDerivative(
  map: (probability: number) => number,
  probability: number,
  stepSize: number = DEFAULT_DERIVATIVE_STEP_SIZE,
): number {
  const lowerBound = Math.max(0, probability - stepSize);
  const upperBound = Math.min(1, probability + stepSize);
  return (map(upperBound) - map(lowerBound)) / (upperBound - lowerBound);
}

// Returns null instead of clamping — clamping would let an overshot drag
// "hug" the boundary at a fixed x while y keeps changing, then jump to the
// neighboring bucket as a near-vertical line.
export function toDomainCoords(
  e: PointerEvent<SVGRectElement>,
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
): { x: number; y: number } | null {
  const svg = e.currentTarget.ownerSVGElement;
  if (!svg) return null;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const svgX = (e.clientX - ctm.e) / ctm.a;
  const svgY = (e.clientY - ctm.f) / ctm.d;
  const x = xScale.invert(svgX);
  const y = yScale.invert(svgY);
  if (x < 0 || x > 1 || y < 0 || y > 1) return null;
  return { x, y };
}
