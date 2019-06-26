import COLORS from "utils/styles";

// finds the largest power of p that divides n
function _findLargestPower(n, p) {
  let absN = Math.abs(n);
  let power = 0;
  while (absN % p === 0 && absN > 1) {
    power++;
    absN /= p;
  }
  return power;
}

// LaTeX string for calculating p-adic difference between two integers
function displayIntegerDifference(num1, num2, prime) {
  const difference = num1 - num2;
  const exp = _findLargestPower(difference, prime);
  let coloredPrime = `\\textcolor{${COLORS.GREEN}}{${prime}}`;
  let coloredExp = `\\textcolor{${COLORS.ORANGE}}{${exp}}`;
  return `
    \\Big \\lvert
      ${num1} - ${num2}
    \\Big \\rvert_${coloredPrime}
    =
    \\Big \\lvert
      ${Math.abs(difference)}
    \\Big \\rvert_${coloredPrime}
    =
    ${difference === 0 ? "0" : ""}
    ${difference !== 0 && exp === 0 ? "1" : ""}
    ${
      exp !== 0
        ? `
    \\Big \\lvert
    ${coloredPrime}^${coloredExp}
    \\times
    ${difference / prime ** exp}
    \\Big \\rvert_${coloredPrime}
    =
    \\frac{1}{${coloredPrime}^${coloredExp}}
    =
    \\frac{1}{${prime ** exp}}
    =
    ${(1 / prime ** exp).toFixed(2)}
    `
        : ""
    }
  `;
}

export { displayIntegerDifference };
