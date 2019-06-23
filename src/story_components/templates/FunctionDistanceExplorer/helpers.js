import { clamp, maxBy } from "lodash";

function clamped(points, xScale, yScale) {
  const xDomain = xScale.domain();
  const yDomain = yScale.domain();
  return points.map((pt, i) => {
    const ptCopy = { ...pt };
    if (i === 0) ptCopy.x = xDomain[0];
    if (i === points.length - 1) ptCopy.x = xDomain[1];
    return {
      x: clamp(ptCopy.x, ...xDomain),
      y: clamp(ptCopy.y, ...yDomain)
    };
  });
}

// takes the draggable points and finds the endpoints
// corresponding to the location of the l-infinity norm.
function lInfNormEndpoints(pts1, pts2) {
  // assume the inner point of pts1 is to the left of the inner point of pts2
  // if not, swap
  if (pts1[1].x > pts2[1].x) [pts1, pts2] = [pts2, pts1];
  const segments = [
    {
      x1: pts1[0].x,
      y1: pts1[0].y,
      x2: pts1[0].x,
      y2: pts2[0].y
    },
    {
      x1: pts1[1].x,
      y1: pts1[1].y,
      x2: pts1[1].x,
      y2: _yOnLine(pts2[0], pts2[1], pts1[1].x)
    },
    {
      x1: pts2[1].x,
      y1: pts2[1].y,
      x2: pts2[1].x,
      y2: _yOnLine(pts1[1], pts1[2], pts2[1].x)
    },
    {
      x1: pts1[2].x,
      y1: pts1[2].y,
      x2: pts1[2].x,
      y2: pts2[2].y
    }
  ];
  return maxBy(segments, seg => Math.abs(seg.y2 - seg.y1));
}

function l1Norm(pts1, pts2) {
  // assume the inner point of pts1 is to the left of the inner point of pts2
  // if not, swap
  if (pts1[1].x > pts2[1].x) [pts1, pts2] = [pts2, pts1];
  const pts1Copy = [...pts1];
  const pts2Copy = [...pts2];
  pts1Copy.splice(2, 0, {
    x: pts2[1].x,
    y: _yOnLine(pts1[1], pts1[2], pts2[1].x)
  });
  pts2Copy.splice(1, 0, {
    x: pts1[1].x,
    y: _yOnLine(pts2[0], pts2[1], pts1[1].x)
  });

  const section1Area = _areaHelper(pts1Copy.slice(0, 2), pts2Copy.slice(0, 2));
  const section2Area = _areaHelper(pts1Copy.slice(1, 3), pts2Copy.slice(1, 3));
  const section3Area = _areaHelper(pts1Copy.slice(2), pts2Copy.slice(2)); // last one is too small???

  // area can be broken into two halves
  return section1Area + section2Area + section3Area;
}

// given the endpoints of a line segment
// and the x coordinate of a point on the line,
// returns the y coordinate of the point
function _yOnLine(pt1, pt2, x) {
  // if y isn't uniquely defined, just return pt1.y
  if (pt1.x === pt2.x) return pt1.y;

  // otherwise, use the equation for a line
  const slope = (pt2.y - pt1.y) / (pt2.x - pt1.x);
  // y - y0 = m(x - x0)
  return slope * (x - pt1.x) + pt1.y;
}

// given four points (2 in pts1, 2 in pts2),
// calculate the area in between the lines
function _areaHelper(pts1, pts2) {
  const leftDiff = pts1[0].y - pts2[0].y;
  const rightDiff = pts1[1].y - pts2[1].y;
  const crossingExists =
    leftDiff && rightDiff && Math.sign(leftDiff) !== Math.sign(rightDiff);

  // case 1: no crossing between the lines
  if (!crossingExists) {
    return Math.abs(_areaUnderLine(...pts1) - _areaUnderLine(...pts2));
  }

  // case 2: the lines intersect
  const slope1 = (pts1[1].y - pts1[0].y) / (pts1[1].x - pts1[0].x);
  const slope2 = (pts2[1].y - pts2[0].y) / (pts2[1].x - pts2[0].x);
  const intersectionX =
    (slope2 * pts2[0].x - slope1 * pts1[0].x) / (slope2 - slope1);
  const intersectionY = slope1 * (intersectionX - pts1[0].x) + pts1[0].y;
  const intersect = { x: intersectionX, y: intersectionY };
  // return two area diffs-- left of intersection, and right of intersection
  const area1 = Math.abs(
    _areaUnderLine(pts1[0], intersect) - _areaUnderLine(pts2[0], intersect)
  );
  const area2 = Math.abs(
    _areaUnderLine(intersect, pts1[1]) - _areaUnderLine(intersect, pts2[1])
  );
  return (area1 + area2) || 0;

  // pts2: x_0, x_1, y_0, y_1
  // line y - y_0 = m (x - x_0)

  // pts1: X_0, X_1, Y_0, Y_1
  // line y - Y_0 = M (x - X_0)
  // y = M(x - X_0) = m(x - x_0)
  // (M - m) x = M * X_0 - m * x_0
  // x = M*X_0 - m* x_0 / (M - m)
}

// calculate the area under a line segment in the first quadrant
function _areaUnderLine(pt1, pt2) {
  let minHeight = Math.min(pt1.y, pt2.y);
  let maxHeight = Math.max(pt1.y, pt2.y);
  let xDist = Math.abs(pt1.x - pt2.x);
  return (xDist * (maxHeight + minHeight)) / 2;
}

export { clamped, lInfNormEndpoints, l1Norm };
