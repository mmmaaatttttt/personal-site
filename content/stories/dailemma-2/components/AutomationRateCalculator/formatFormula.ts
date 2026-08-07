import { clamp } from "@/utils/mathHelpers";
import COLORS from "@/utils/styles";

const DECIMALS = 2;

function fmt(value: number): string {
  return value.toFixed(DECIMALS);
}

function colored(value: string, color: string): string {
  return `\\textcolor{${color}}{${value}}`;
}

// Shows the raw (unclamped) computation honestly, then an arrow to the
// clamped rate whenever clamping actually changes the value — instead of
// silently printing a false equation like "(0.5 - 0.8) / 1 = 0".
function formatResult(raw: number): string {
  const clamped = clamp(raw, 0, 1);
  if (raw === clamped) return fmt(clamped);
  return `${fmt(raw)} \\rightarrow ${fmt(clamped)}`;
}

export function nashFormulaLatex(
  savings: number,
  demandLoss: number,
  difficulty: number,
  numFirms: number,
): string {
  const raw = (savings - demandLoss / numFirms) / difficulty;
  const s = colored(fmt(savings), COLORS.ORANGE);
  const l = colored(fmt(demandLoss), COLORS.BLUE);
  const n = colored(String(numFirms), COLORS.DARK_GRAY);
  const d = colored(fmt(difficulty), COLORS.PURPLE);
  return `\\text{Free market } a = \\frac{${s} - \\frac{${l}}{${n}}}{${d}} = ${formatResult(raw)}`;
}

export function cooperativeFormulaLatex(
  savings: number,
  demandLoss: number,
  difficulty: number,
): string {
  const raw = (savings - demandLoss) / difficulty;
  const s = colored(fmt(savings), COLORS.ORANGE);
  const l = colored(fmt(demandLoss), COLORS.BLUE);
  const d = colored(fmt(difficulty), COLORS.PURPLE);
  return `\\text{Coordinated } a = \\frac{${s} - ${l}}{${d}} = ${formatResult(raw)}`;
}
