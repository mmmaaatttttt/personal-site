function pAdicNorm(num: number, p: number): number {
  let absN = Math.abs(num);
  let power = 0;
  while (absN % p === 0 && absN > 1) {
    power++;
    absN /= p;
  }
  return p ** -power;
}

export function generateGrid(size: number, prime: number): (number | null)[][] {
  return Array.from({ length: size }, (_, yIdx) =>
    Array.from({ length: size }, (_, xIdx) => {
      if (yIdx < xIdx) return null;
      return pAdicNorm(xIdx - yIdx, prime);
    }),
  );
}
