import COLORS from "@/utils/styles";
import { findLargestPower } from "../../padicMath";

export function displayIntegerDifference(
  num1: number,
  num2: number,
  prime: number,
): string {
  const difference = num1 - num2;
  const exp = findLargestPower(difference, prime);
  const coloredPrime = `\\textcolor{${COLORS.GREEN}}{${prime}}`;
  const coloredExp = `\\textcolor{${COLORS.ORANGE}}{${exp}}`;
  return `
    \\Big \\lvert
      ${num1} - ${num2}
    \\Big \\rvert_{${coloredPrime}}
    =
    \\Big \\lvert
      ${difference}
    \\Big \\rvert_{${coloredPrime}}
    =
    ${difference === 0 ? "0" : ""}
    ${difference !== 0 && exp === 0 ? "1" : ""}
    ${
      exp !== 0
        ? `
    \\Big \\lvert
    ${coloredPrime}^{${coloredExp}}
    \\times
    ${difference / prime ** exp}
    \\Big \\rvert_{${coloredPrime}}
    \\\\ =
    \\frac{1}{${coloredPrime}^{${coloredExp}}}
    =
    \\frac{1}{${prime ** exp}}
    =
    ${1 / prime ** exp}
    `
        : ""
    }
  `;
}
