import COLORS from "@/utils/styles";

export function completerResponseRate(
  trueResponseRate: number,
  baselineCompletionResponder: number,
  baselineCompletionNonResponder: number,
): number {
  const responderSurvival = trueResponseRate * baselineCompletionResponder;
  const nonResponderSurvival =
    (1 - trueResponseRate) * baselineCompletionNonResponder;
  return responderSurvival / (responderSurvival + nonResponderSurvival);
}

const LEFT_WIDTH_PLACEHOLDER = "10";
const RIGHT_WIDTH_PLACEHOLDER = "0\\%";

const UNDEFINED_RESULT = "\\text{---}";

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(0)}\\%`;
}

function fixedWidth(content: string): string {
  return `\\hphantom{${LEFT_WIDTH_PLACEHOLDER}}\\mathclap{${content}}\\hphantom{${RIGHT_WIDTH_PLACEHOLDER}}`;
}

function coloredPercent(value: number, color: string): string {
  return fixedWidth(`\\textcolor{${color}}{${formatPercent(value)}}`);
}

export function trueRateLatex(trueResponseRate: number): string {
  return coloredPercent(trueResponseRate, COLORS.PURPLE);
}

export function observedRateLatex(
  trueResponseRate: number,
  baselineCompletionResponder: number,
  baselineCompletionNonResponder: number,
): string {
  const observed = completerResponseRate(
    trueResponseRate,
    baselineCompletionResponder,
    baselineCompletionNonResponder,
  );
  const trueRateTerm = coloredPercent(trueResponseRate, COLORS.PURPLE);
  const trueNonResponseRateTerm = coloredPercent(
    1 - trueResponseRate,
    COLORS.PURPLE,
  );
  const responderCompletionTerm = coloredPercent(
    baselineCompletionResponder,
    COLORS.DARK_GREEN,
  );
  const nonResponderCompletionTerm = coloredPercent(
    baselineCompletionNonResponder,
    COLORS.RED,
  );
  const result = fixedWidth(
    Number.isNaN(observed) ? UNDEFINED_RESULT : formatPercent(observed),
  );
  return `\\frac{${trueRateTerm} \\times ${responderCompletionTerm}}{${trueRateTerm} \\times ${responderCompletionTerm} + ${trueNonResponseRateTerm} \\times ${nonResponderCompletionTerm}} = ${result}`;
}
