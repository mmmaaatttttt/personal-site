import type { Point } from "@/types/geometry";

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function clamped(
  points: Point[],
  [xMin, xMax]: [number, number],
  [yMin, yMax]: [number, number],
): Point[] {
  return points.map((pt) => ({
    x: Math.min(Math.max(pt.x, xMin), xMax),
    y: Math.min(Math.max(pt.y, yMin), yMax),
  }));
}

// Returns the segment [x1,y1]→[x2,y2] where the vertical distance is largest.
// pts1 and pts2 are each three SVG-pixel points (left, middle, right endpoints).
export function lInfNormEndpoints(pts1: Point[], pts2: Point[]): Segment {
  let a = pts1;
  let b = pts2;
  if (a[1].x > b[1].x) [a, b] = [b, a];

  const segments: Segment[] = [
    { x1: a[0].x, y1: a[0].y, x2: a[0].x, y2: b[0].y },
    {
      x1: a[1].x,
      y1: a[1].y,
      x2: a[1].x,
      y2: yOnLine(b[0], b[1], a[1].x),
    },
    {
      x1: b[1].x,
      y1: b[1].y,
      x2: b[1].x,
      y2: yOnLine(a[1], a[2], b[1].x),
    },
    { x1: a[2].x, y1: a[2].y, x2: a[2].x, y2: b[2].y },
  ];

  return segments.reduce((best, seg) =>
    Math.abs(seg.y2 - seg.y1) > Math.abs(best.y2 - best.y1) ? seg : best,
  );
}

// Computes the L1 (area) distance between two piecewise-linear functions.
// pts1 and pts2 are data-space points (not SVG pixels).
export function l1Norm(pts1: Point[], pts2: Point[]): number {
  let a = [...pts1];
  let b = [...pts2];
  if (a[1].x > b[1].x) [a, b] = [b, a];

  const aCopy = [...a];
  const bCopy = [...b];
  aCopy.splice(2, 0, { x: b[1].x, y: yOnLine(a[1], a[2], b[1].x) });
  bCopy.splice(1, 0, { x: a[1].x, y: yOnLine(b[0], b[1], a[1].x) });

  return (
    areaHelper(aCopy.slice(0, 2), bCopy.slice(0, 2)) +
    areaHelper(aCopy.slice(1, 3), bCopy.slice(1, 3)) +
    areaHelper(aCopy.slice(2), bCopy.slice(2))
  );
}

export function yOnLine(pt1: Point, pt2: Point, x: number): number {
  if (pt1.x === pt2.x) return pt1.y;
  const slope = (pt2.y - pt1.y) / (pt2.x - pt1.x);
  return slope * (x - pt1.x) + pt1.y;
}

export function areaHelper(pts1: Point[], pts2: Point[]): number {
  const leftDiff = pts1[0].y - pts2[0].y;
  const rightDiff = pts1[1].y - pts2[1].y;
  const crossingExists =
    leftDiff !== 0 &&
    rightDiff !== 0 &&
    Math.sign(leftDiff) !== Math.sign(rightDiff);

  if (!crossingExists) {
    return Math.abs(
      areaUnderLine(pts1[0], pts1[1]) - areaUnderLine(pts2[0], pts2[1]),
    );
  }

  const slope1 = (pts1[1].y - pts1[0].y) / (pts1[1].x - pts1[0].x);
  const slope2 = (pts2[1].y - pts2[0].y) / (pts2[1].x - pts2[0].x);
  const intersectionX =
    (slope2 * pts2[0].x - slope1 * pts1[0].x) / (slope2 - slope1);
  const intersectionY = slope1 * (intersectionX - pts1[0].x) + pts1[0].y;
  const intersect: Point = { x: intersectionX, y: intersectionY };

  return (
    Math.abs(
      areaUnderLine(pts1[0], intersect) - areaUnderLine(pts2[0], intersect),
    ) +
    (Math.abs(
      areaUnderLine(intersect, pts1[1]) - areaUnderLine(intersect, pts2[1]),
    ) || 0)
  );
}

export function areaUnderLine(pt1: Point, pt2: Point): number {
  const minH = Math.min(pt1.y, pt2.y);
  const maxH = Math.max(pt1.y, pt2.y);
  const xDist = Math.abs(pt1.x - pt2.x);
  return (xDist * (maxH + minH)) / 2;
}
