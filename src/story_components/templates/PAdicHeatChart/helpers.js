/**
 * Calculates the p-adic norm of a given number whole number num.
 * @param {Number} num
 * @param {Number} p
 */
function pAdicNorm(num, p) {
  let absN = Math.abs(num);
  let power = 0;
  while (absN % p === 0 && absN > 1) {
    power++;
    absN /= p;
  }
  return p ** -power;
}

// Generates a matrix of p-adic values from 1 up to the size of the grid
function generateGrid(size, prime) {
  const grid = Array.from({ length: size }, (_, yIdx) =>
    Array.from({ length: size }, (_, xIdx) => {
      if (yIdx < xIdx) return null;
      const xNum = xIdx + 1;
      const yNum = size - yIdx;
      return pAdicNorm(yNum - xNum, prime);
    })
  );
  return grid;
}

export { generateGrid };
