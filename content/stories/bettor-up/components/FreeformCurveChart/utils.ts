import type { ScaleLinear } from "d3-scale";
import { scaleLinear } from "d3-scale";
import type { PointerEvent } from "react";
import type { Point } from "@/types/geometry";
import { clamp, interpolate } from "@/utils/mathHelpers";

export const RESOLUTION = 200;
const DEFAULT_DERIVATIVE_STEP_SIZE = 0.001;
const INITIAL_VALUE = 0.5;

/**
 * Starting curve: a flat line, not the diagonal itself. The diagonal
 * (probability -> probability) trivially satisfies the fixed-point equation
 * at every single point, so any curve that's still mostly untouched diagonal
 * — including right after the very first click, before any painting has
 * happened — produces a "crossing" at nearly every sampled point. A flat
 * line crosses the diagonal at exactly one honest point (INITIAL_VALUE), so
 * there's no degenerate case to guard against.
 */
export function createInitialBuckets(resolution: number): number[] {
  return Array.from({ length: resolution + 1 }, () => INITIAL_VALUE);
}

/**
 * Paints a straight segment between two drawn points into the bucket array,
 * overwriting whichever buckets it passes over. Because every write replaces
 * whatever was there — regardless of which direction the pointer moved, or
 * whether it doubled back on itself — the result is always single-valued:
 * the constraint that this is a valid function enforces itself, rather than
 * needing to reject invalid drawing gestures.
 */
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

/**
 * Piecewise-linear interpolation between buckets, so the curve can be
 * sampled at any probability, not just drawn grid points. Delegates to
 * d3-scale's multi-point scaleLinear rather than hand-rolling the same
 * piecewise interpolation it already provides.
 */
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

/**
 * Converts a pointer event on an SVG rect into [0,1]x[0,1] domain
 * coordinates, or null if the pointer is outside that domain.
 *
 * Returning null rather than clamping matters: clamping lets a drag that
 * overshoots the edge "hug" that boundary — every move gets clamped to the
 * same x, so the one bucket there keeps getting overwritten while y keeps
 * changing, and the eventual jump to the neighboring bucket renders as a
 * near-vertical line. Refusing to report a position outside the box means
 * reaching x=0 or x=1 takes real pixel precision, which a mouse won't
 * sustain for a drag.
 */
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
