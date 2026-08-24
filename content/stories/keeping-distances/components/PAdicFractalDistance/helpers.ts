export interface PAdicPoint {
  cx: number;
  cy: number;
  fillIdx: number;
  num: number;
}

function magnitudeExponent(n: number, p: number): number {
  if (n === 0) return 0;
  return Math.floor(Math.log(n) / Math.log(p));
}

function pAdicExpansion(num: number, prime: number): number[] {
  const maxPow = magnitudeExponent(num, prime);
  const coeffs = Array.from<number>({ length: maxPow + 1 }).fill(0);
  let remaining = num;
  for (let exp = coeffs.length - 1; exp > 0; exp--) {
    const coeff = Math.floor(remaining / prime ** exp);
    coeffs[exp] = coeff;
    remaining -= coeff * prime ** exp;
  }
  coeffs[0] = remaining;
  return coeffs;
}

function pointSum(
  points: PAdicPoint[],
  n: number,
  k: number,
  a_k: number,
  prime: number,
  key: "cx" | "cy",
): number {
  const firstIdx = n % prime ** k;
  const secondIdx = (n + a_k * prime ** (k - 1)) % prime ** k;
  return ((prime - 1) * points[firstIdx][key] + points[secondIdx][key]) / prime;
}

export function generatePAdicPoints(
  prime: number,
  level: number,
): PAdicPoint[] {
  const points: PAdicPoint[] = Array.from({ length: prime }, (_, i) => {
    const angle = (Math.PI * 2 * i) / prime + Math.PI / 2;
    return { cx: Math.cos(angle), cy: Math.sin(angle), fillIdx: 0, num: i };
  });
  while (points.length < prime ** level) {
    const nextNum = points.length;
    const digits = pAdicExpansion(nextNum, prime);
    const lastDigit = digits[digits.length - 1];
    const highestPower = digits.length - 1;
    points.push({
      cx: pointSum(points, nextNum, highestPower, lastDigit, prime, "cx"),
      cy: pointSum(points, nextNum, highestPower, lastDigit, prime, "cy"),
      fillIdx: magnitudeExponent(nextNum, prime),
      num: nextNum,
    });
  }
  return points;
}

export function getStartIdx(
  num: number,
  prime: number,
  points: PAdicPoint[],
): number {
  let idx = 0;
  const exp = magnitudeExponent(num, prime);
  if (exp > 0) idx = num % prime ** exp;
  return Math.min(idx, points.length - 1);
}

export function showLabel(prime: number, level: number, num: number): boolean {
  return (prime === 3 || level < 3) && num < prime ** level;
}
