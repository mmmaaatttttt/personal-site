/**
 * Given a radius, calculates all points on the discrete circle
 * of that radius, for the Manhattan distance.
 *
 * Example Input: generateCirclePoints(1)
 * Example Output: [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}]
 * @param {Number} radius
 */
function generateCirclePoints(radius) {
  const points = [];
  for (var i = 0; i < radius; i++) {
    // push one point in for each quadrant
    points.push(
      { x: radius - i, y: i },
      { x: -i, y: radius - i },
      { x: i - radius, y: -i },
      { x: i, y: i - radius }
    );
  }
  return points;
}

export { generateCirclePoints };
