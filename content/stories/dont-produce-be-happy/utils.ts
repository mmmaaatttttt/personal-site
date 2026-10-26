export function linearRegression(points: { x: number; y: number }[]): {
  slope: number;
  intercept: number;
  rSquared: number;
} {
  const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const numerator = points.reduce(
    (sum, point) => sum + (point.x - meanX) * (point.y - meanY),
    0,
  );
  const denominator = points.reduce(
    (sum, point) => sum + (point.x - meanX) ** 2,
    0,
  );
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  const totalSumSquares = points.reduce(
    (sum, point) => sum + (point.y - meanY) ** 2,
    0,
  );
  const residualSumSquares = points.reduce((sum, point) => {
    const predicted = intercept + slope * point.x;
    return sum + (point.y - predicted) ** 2;
  }, 0);
  const rSquared = 1 - residualSumSquares / totalSumSquares;

  return { slope, intercept, rSquared };
}
