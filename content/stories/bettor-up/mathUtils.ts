import type { Point } from "@/types/geometry";

export interface FixedPoint {
  probability: number;
  slope: number;
  stable: boolean;
}

const BISECTION_ITERATIONS = 60;
const SCAN_RESOLUTION = 2000;
const PROBABILITY_MIN = 0;
const PROBABILITY_MAX = 1;

/** Cobweb staircase: alternates vertical moves to the curve and horizontal moves to the diagonal. */
export function buildCobwebPath(
  map: (probability: number) => number,
  startingProbability: number,
  steps: number,
): Point[] {
  const points: Point[] = [{ x: startingProbability, y: 0 }];
  let x = startingProbability;
  for (let i = 0; i < steps; i++) {
    const rawY = map(x);
    const y = Math.min(PROBABILITY_MAX, Math.max(PROBABILITY_MIN, rawY));
    points.push({ x, y });
    points.push({ x: y, y });
    x = y;
    if (rawY !== y) break;
  }
  return points;
}

function bisect(
  gap: (probability: number) => number,
  low: number,
  high: number,
): number {
  let currentLow = low;
  let currentHigh = high;
  let gapAtLow = gap(currentLow);
  for (let i = 0; i < BISECTION_ITERATIONS; i++) {
    const midpoint = (currentLow + currentHigh) / 2;
    const gapAtMidpoint = gap(midpoint);
    if (Math.sign(gapAtMidpoint) === Math.sign(gapAtLow)) {
      currentLow = midpoint;
      gapAtLow = gapAtMidpoint;
    } else {
      currentHigh = midpoint;
    }
  }
  return (currentLow + currentHigh) / 2;
}

/**
 * Grid scan + bisection. The nonzero guard on previousGap prevents a
 * spurious second root next to an exact zero that lands on the grid.
 */
export function findFixedPoints(
  map: (probability: number) => number,
  mapDerivative: (probability: number) => number,
  resolution: number = SCAN_RESOLUTION,
): FixedPoint[] {
  const gap = (probability: number) => map(probability) - probability;
  const toFixedPoint = (probability: number): FixedPoint => {
    const slope = mapDerivative(probability);
    return { probability, slope, stable: Math.abs(slope) < 1 };
  };

  const fixedPoints: FixedPoint[] = [];
  let previousProbability = 0;
  let previousGap = gap(0);
  if (previousGap === 0) fixedPoints.push(toFixedPoint(0));

  for (let i = 1; i <= resolution; i++) {
    const probability = i / resolution;
    const currentGap = gap(probability);
    if (currentGap === 0) {
      fixedPoints.push(toFixedPoint(probability));
    } else if (
      previousGap !== 0 &&
      Math.sign(currentGap) !== Math.sign(previousGap)
    ) {
      fixedPoints.push(
        toFixedPoint(bisect(gap, previousProbability, probability)),
      );
    }
    previousProbability = probability;
    previousGap = currentGap;
  }

  return fixedPoints;
}
