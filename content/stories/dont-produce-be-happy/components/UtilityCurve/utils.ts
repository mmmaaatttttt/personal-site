export function regressionEquationLatex(
  intercept: number,
  slope: number,
  rSquared: number,
): string {
  return `y = ${intercept.toFixed(2)} + ${slope.toFixed(2)}\\ln(x), \\quad R^2 = ${rSquared.toFixed(2)}`;
}
