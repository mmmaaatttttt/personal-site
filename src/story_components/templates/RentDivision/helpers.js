import COLORS from "utils/styles";
import { interpolate } from "utils/mathHelpers";

/**
 * Determines the label of a point given two labeled neighbors
 * In our example, this uniquely determines the label of a point, since every trinagle should
 * have distinct labels.
 * For example, if neighbor1.label is "A" and neighbor2.label is "B",
 * the only label remaining is "C".
 *
 * @param {Object} neighbor1 - the first neighbor object
 * @param {Object} neighbor2 - the second neighbor object
 * @param {Array} names - array  of names for labels
 */
const deduceLabel = (neighbor1, neighbor2, names) => {
  const label1 = neighbor1.label;
  const label2 = neighbor2.label;
  return names
    .map(name => name[0])
    .find(ltr => ltr !== label1 && ltr !== label2);
};

/**
 * Generates data on every row of points
 * in the triangulation. For example, given the following diagram:
 *
 *         1
 *       /   \
 *      2 --- 3
 *    /   \ /   \
 *   4 --- 5 --- 6
 *
 * it should generate an array of the form
 * [
 *   [ { 1 data } ],
 *   [ { 2 data }, { 3 data } ],
 *   [ { 4 data }, { 5 data }, { 6 data } ]
 * ]
 *
 * Note that this function doesn't add labels. This is done after the data
 * has been generated.
 *
 * @param {Number} meshLevels - size of the mesh
 * @param {Array} corners - array of info on the corners of the triangle
 * @param {Number} initialR - radius of nodes
 * @param {Array} names - array of string labels
 */
const generateAllPoints = (meshLevels, corners, initialR, names) => {
  const rowCount = 2 ** (meshLevels - 1) + 1;
  let pointsWithoutLabels = Array.from({ length: rowCount }, (_, rowIdx) => {
    if (rowIdx === 0) {
      return [{ ...corners[0], color: COLORS.BLACK, r: initialR / meshLevels }];
    }
    let fraction = rowIdx / (rowCount - 1);
    let [top, left, right] = corners;
    let firstPoint = generatePoint(
      left,
      top,
      fraction,
      meshLevels,
      initialR
    );
    let lastPoint = generatePoint(
      right,
      top,
      fraction,
      meshLevels,
      initialR
    );
    if (rowIdx === 1) {
      return [firstPoint, lastPoint];
    }
    let points = [firstPoint];
    for (var i = 1; i < rowIdx; i++) {
      let rowFraction = i / rowIdx;
      let newPoint = generatePoint(
        lastPoint,
        firstPoint,
        rowFraction,
        meshLevels,
        initialR
      );
      points.push(newPoint);
    }
    points.push(lastPoint);
    return points;
  });
  return generateLabels(pointsWithoutLabels, names);
};

/**
 * Given an array of arrays of points objects without labels,
 * this adds labels. Labels are specified uniquely subject to the initial condition
 * that the top corner is "A", and the two points in the next row are "B" and "C".
 *
 * @param {Array} points - points object data without labels
 * @param {Array} names - array of string label names
 */
const generateLabels = (points, names) => {
  points[0][0].label = names[0][0];
  points[1][0].label = names[1][0];
  points[1][1].label = names[2][0];
  for (let rowIdx = 2; rowIdx < points.length; rowIdx++) {
    for (let cellIdx = 1; cellIdx < rowIdx; cellIdx++) {
      // generate labels for interior points in the row
      let leftParent = points[rowIdx - 1][cellIdx - 1];
      let rightParent = points[rowIdx - 1][cellIdx];
      points[rowIdx][cellIdx].label = deduceLabel(
        leftParent,
        rightParent,
        names
      );
    }
    // generate labels for first and last points in the row
    points[rowIdx][0].label = deduceLabel(
      points[rowIdx - 1][0],
      points[rowIdx][1],
      names
    );
    points[rowIdx][rowIdx].label = deduceLabel(
      points[rowIdx - 1][rowIdx - 1],
      points[rowIdx][rowIdx - 1],
      names
    );
  }
  return points;
};

/**
 * Given two point objects pt1 and pt2, and an interpolation value frac1 between
 * 0 and 1, this creates a new initial point.
 *
 * Used in the constructor.
 *
 * @param {Object} pt1 - First point
 * @param {Object} pt2 - Second point
 * @param {Number} frac - Number between 0 and 1
 * @param {Number} meshLevels - meshLevels value
 * @param {Number} initialR - radius of nodes
 */
const generatePoint = (pt1, pt2, frac, meshLevels, initialR) => {
  return {
    x: interpolate(pt1.x, pt2.x, frac),
    y: interpolate(pt1.y, pt2.y, frac),
    color: COLORS.BLACK,
    prices: pt1.prices.map((price, i) =>
      interpolate(price, pt2.prices[i], frac)
    ),
    r: initialR / meshLevels
  };
};

export { generateAllPoints };
