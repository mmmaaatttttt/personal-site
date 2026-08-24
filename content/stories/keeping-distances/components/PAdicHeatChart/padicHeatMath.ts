import { findLargestPower } from "../../padicMath";

function pAdicNorm(num: number, p: number): number {
  return p ** -findLargestPower(num, p);
}

export function generateGrid(size: number, prime: number): (number | null)[][] {
  return Array.from({ length: size }, (_, yIdx) =>
    Array.from({ length: size }, (_, xIdx) => {
      if (yIdx < xIdx) return null;
      return pAdicNorm(xIdx - yIdx, prime);
    }),
  );
}
