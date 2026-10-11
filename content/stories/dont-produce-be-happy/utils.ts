export function linearRegression(points: { x: number; y: number }[]): {
  slope: number;
  intercept: number;
  rSquared: number;
} {
  const meanX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  const numerator = points.reduce(
    (sum, p) => sum + (p.x - meanX) * (p.y - meanY),
    0,
  );
  const denominator = points.reduce((sum, p) => sum + (p.x - meanX) ** 2, 0);
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  const totalSumSquares = points.reduce(
    (sum, p) => sum + (p.y - meanY) ** 2,
    0,
  );
  const residualSumSquares = points.reduce((sum, p) => {
    const predicted = intercept + slope * p.x;
    return sum + (p.y - predicted) ** 2;
  }, 0);
  const rSquared = 1 - residualSumSquares / totalSumSquares;

  return { slope, intercept, rSquared };
}
