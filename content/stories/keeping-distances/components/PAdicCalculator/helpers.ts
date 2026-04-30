export function findLargestPower(n: number, p: number): number {
  let absN = Math.abs(n);
  let power = 0;
  while (absN % p === 0 && absN > 1) {
    power++;
    absN /= p;
  }
  return power;
}
