import type { Point } from "@/types/geometry";
import { mod } from "@/utils/mathHelpers";

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Two segments intersect when their interiors cross (endpoints touching is ignored via epsilon bounds).
// cf: https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
function doLinesIntersect(seg1: Segment, seg2: Segment): boolean {
  const seg1XDiff = seg1.x2 - seg1.x1;
  const seg1YDiff = seg1.y2 - seg1.y1;
  const seg2XDiff = seg2.x2 - seg2.x1;
  const seg2YDiff = seg2.y2 - seg2.y1;
  const det = seg1XDiff * seg2YDiff - seg2XDiff * seg1YDiff;

  if (det === 0) return false;

  const crossXDiff = seg2.x2 - seg1.x1;
  const crossYDiff = seg2.y2 - seg1.y1;

  const lambda = (seg2YDiff * crossXDiff - seg2XDiff * crossYDiff) / det;
  const gamma = (seg1XDiff * crossYDiff - seg1YDiff * crossXDiff) / det;
  const lowerBound = 1e-6;
  const upperBound = 1 - lowerBound;

  return (
    lowerBound < lambda &&
    lambda < upperBound &&
    lowerBound < gamma &&
    gamma < upperBound
  );
}

// Given an array of points (forming a closed polygon) and the index of a just-moved point,
// returns true if any polygon edge now crosses another edge it shouldn't share.
export function crossingExists(points: Point[], idx: number): boolean {
  const segments: Segment[] = points.map((pt, i) => {
    const next = points[mod(i + 1, points.length)];
    return { x1: pt.x, y1: pt.y, x2: next.x, y2: next.y };
  });

  const potentialCrossingSegments = [
    segments[idx],
    segments[mod(idx - 1, segments.length)],
  ];

  for (const seg of segments) {
    if (potentialCrossingSegments.includes(seg)) continue;
    if (
      potentialCrossingSegments.some((other) => doLinesIntersect(seg, other))
    ) {
      return true;
    }
  }
  return false;
}
