import { average, mod } from "utils/mathHelpers";

/**
 * Generate an array of evenly-spaced x-y coordinate pairs given a count of the
 * total number of pairs, along with data on the containing SVG dimensions.
 *
 * @export
 * @param {Object} param0 - input argument
 * @param {Number} param0.width - width of SVG
 * @param {Number} param0.height - height of SVG
 * @param {Number} param0.initialSides - number of sides in initial configuration
 * @param {Number} param0.newCount - number of sides in new configuration
 * @returns {Object[]} - Array of coordinate pairs evenly spaced along a circle
 */
export function generatePointsFromCount({
  width,
  height,
  initialSides,
  newCount
}) {
  return Array.from({ length: newCount }, (_, i) => {
    const angle = (2 * Math.PI * i) / newCount - Math.PI / 2;

    // normalize the distance so that it's 100 when newCount is 3,
    // and otherwise is such that the area of the corresponding circle
    // is constant
    const distance =
      (initialSides * 100 * Math.sin(Math.PI / initialSides)) /
      (newCount * Math.sin(Math.PI / newCount));

    return {
      x: width / 2 + distance * Math.cos(angle),
      y: height / 2 + distance * Math.sin(angle)
    };
  });
}

// given an array of points and a point index,
// determine whether any segments joining the points together
// have a nontrivial intersection
export function crossingExists(points, idx) {
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

/**
 * Given an array of x-y coordinates, return the average position
 * and total distance along the path.
 *
 * @export
 * @param {Object[]} points - Array of point coordinates
 * @returns {Object} - Summary path data
 */
export function getCircleParams(points) {
  let { x, y } = _getCenter(points);
  let r = _getLength(points) / (2 * Math.PI);
  return { x, y, r };
}

/**
 * Given an array of x-y coordinates and other area information,
 * return a comparison of the area enclosed by the coordinates as compared
 * to a circle of the same perimeter. (i.e. perform an isoperimetric inequality comparison)
 *
 * @export
 * @param {Object} param0 - input argument
 * @param {Object[]} param0.points - width of SVG
 * @param {Number} param0.baseArea - height of SVG
 * @param {Number} param0.radius - number of sides in initial configuration
 * @returns - isoperimetric inequality data
 */
export function getAreaInfo({ points, baseArea, radius }) {
  let circleArea = Math.PI * radius ** 2;
  let normalizedCircleArea = (100 * circleArea) / baseArea;

  // area calculation for arbitrary polygon, see:
  // https://www.mathopenref.com/coordpolygonarea2.html
  let polygonArea = Math.abs(
    points.reduce((area, point, i) => {
      let nextPoint = points[mod(i + 1, points.length)];
      return area + (point.x + nextPoint.x) * (-point.y + nextPoint.y);
    }, 0) / 2
  );
  let normalizedPolygonArea = (100 * polygonArea) / baseArea;
  return {
    circleArea: normalizedCircleArea.toFixed(2),
    polygonArea: normalizedPolygonArea.toFixed(2),
    ratio: (polygonArea / circleArea).toFixed(2)
  };
}

/**
 * Given an array of x-y coordinates, return the average position.
 *
 * @param {Object[]} points - Array of point coordinates
 * @returns {Object} - Average position of the input points
 */
function _getCenter(points) {
  return {
    x: average(points, p => p.x),
    y: average(points, p => p.y)
  };
}

/**
 * Given an array of x-y coordinates, return the total distance
 * of the path traced along the coordinates.
 *
 * @param {Object[]} points - Array of point coordinates
 * @returns - Perimeter of the polygon determined by the points
 */
function _getLength(points) {
  return points.reduce((length, point, i) => {
    let nextPoint = points[mod(i + 1, points.length)];
    let xSquare = (point.x - nextPoint.x) ** 2;
    let ySquare = (point.y - nextPoint.y) ** 2;
    let newDistance = (xSquare + ySquare) ** (1 / 2);
    return length + newDistance;
  }, 0);
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
