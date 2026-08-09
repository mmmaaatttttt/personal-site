import type { Point } from "@/types/geometry";

export interface FixedPoint {
  probability: number;
  slope: number;
  stable: boolean;
}

const BISECTION_ITERATIONS = 60;
const SCAN_RESOLUTION = 2000;

/**
 * Builds the staircase path of a cobweb diagram: alternating vertical moves
 * to the curve and horizontal moves to the diagonal, starting from
 * startingProbability on the x-axis.
 */
export function buildCobwebPath(
  map: (probability: number) => number,
  startingProbability: number,
  steps: number,
): Point[] {
  const points: Point[] = [{ x: startingProbability, y: 0 }];
  let x = startingProbability;
  for (let i = 0; i < steps; i++) {
    const y = map(x);
    points.push({ x, y });
    points.push({ x: y, y });
    x = y;
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
 * Finds all fixed points of map in [0, 1] by scanning map(probability) -
 * probability on a grid. A grid point landing exactly on a root is recorded
 * directly; a sign change between two consecutive *nonzero* samples is
 * refined via bisection. The nonzero guard matters because a map like the
 * logistic teaching case has an exact fixed point at probability=0.5 that
 * lands on the grid — without it, the point immediately after that exact
 * zero would spuriously bracket a second, bogus root right next to the real
 * one.
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
