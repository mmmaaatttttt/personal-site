// generates an array of path strings of the form "xxyyyyy"
// in other words, move over 2 spaces in x, followed by 5 spaces up in y.
function generatePathOptions(pathHeight, pathWidth, memo = {}, paths = [""]) {
  if (pathHeight + pathWidth === 0) return paths;
  if (pathWidth === 0) return paths.map(p => p + "y".repeat(pathHeight));
  if (pathHeight === 0) return paths.map(p => p + "x".repeat(pathWidth));
  const key = `${pathHeight}|${pathWidth}`;
  if (memo[key]) return memo[key];
  memo[key] = [
    // paths obtained if the most recent move was vertical
    ...generatePathOptions(pathHeight - 1, pathWidth, memo, paths).map(
      p => p + "y"
    ),
    // paths obtained if the most recent move was horizontal
    ...generatePathOptions(pathHeight, pathWidth - 1, memo, paths).map(
      p => p + "x"
    )
  ];
  return memo[key];
}

// given a path string like "xxy", generate an array of coordinates
// starting from the origin, e.g.
// [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }]
function generatePathPoints(pathStr) {
  const points = [{ x: 0, y: 0 }];
  for (let xOrY of pathStr) {
    const prevPtCopy = { ...points[points.length - 1] };
    prevPtCopy[xOrY]++;
    points.push(prevPtCopy);
  }
  return points;
}

// generates an array of grid points
// given the domains of the x and y scales.
// omits the origin, since this point isn't clickable.
function generateGridPoints(xScale, yScale) {
  const [xMin, xMax] = xScale.domain();
  const [yMin, yMax] = yScale.domain();
  const xLen = xMax - xMin + 1;
  const yLen = yMax - yMin + 1;
  return Array.from({ length: xLen * yLen - 1 }, (_, idx) => {
    const x = (idx + 1) % xLen;
    const y = Math.floor((idx + 1) / yLen);
    return { x, y };
  });
}

export { generatePathOptions, generatePathPoints, generateGridPoints };
