import { mod } from "utils/mathHelpers";

// given an array of points and a point index,
// determine whether any segments joining the points together
// have a nontrivial intersection
function crossingExists(points, idx) {
  const segments = points.map((currentPt, i) => {
    const nextPtIdx = mod(i + 1, points.length);
    const nextPt = points[nextPtIdx];
    return {
      x1: currentPt.x,
      y1: currentPt.y,
      x2: nextPt.x,
      y2: nextPt.y
    };
  });

  // if an intersection exists, it must be with a segment whose point is at index idx
  const potentialCrossingSegments = [
    segments[idx],
    segments[mod(idx - 1, segments.length)]
  ];

  for (let segIdx in segments) {
    const seg = segments[segIdx];
    // skip over the candidate segments
    if (potentialCrossingSegments.includes(seg)) continue;

    // if you find an intersection, return true
    if (
      potentialCrossingSegments.some(otherSeg =>
        _doLinesIntersect(seg, otherSeg)
      )
    ) {
      return true;
    }
  }

  // if we make it out of the loop, there's no intersection
  return false;
}

// checks whether two segments (objects with x1, x2, y1, y2) intersect.
// cf: https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
function _doLinesIntersect(seg1, seg2) {
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
  const lambdaWithinBounds = lowerBound < lambda && lambda < upperBound;
  const gammaWithinBounds = lowerBound < gamma && gamma < upperBound;

  return lambdaWithinBounds && gammaWithinBounds;
}

export { crossingExists };
