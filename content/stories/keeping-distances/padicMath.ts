/**
 * The p-adic valuation of n: the largest power of p that divides n.
 * Shared between PAdicCalculator (computing |num1 - num2|_p) and
 * PAdicHeatChart (computing the p-adic norm for the whole grid) — both need
 * exactly this quantity, not the base-p digit count PAdicFractalDistance
 * computes (a different quantity that happens to coincide only when n is an
 * exact power of p).
 */
export function findLargestPower(n: number, p: number): number {
  let absN = Math.abs(n);
  let power = 0;
  while (absN % p === 0 && absN > 1) {
    power++;
    absN /= p;
  }
  return power;
}
