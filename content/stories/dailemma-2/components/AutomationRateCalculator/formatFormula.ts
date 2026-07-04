import COLORS from "@/utils/styles";
import { alphaCO, alphaNE } from "../../../dailemma/math";

const DECIMALS = 2;

function fmt(value: number): string {
  return value.toFixed(DECIMALS);
}

function colored(value: string, color: string): string {
  return `\\textcolor{${color}}{${value}}`;
}

export function nashFormulaLatex(
  savings: number,
  demandLoss: number,
  difficulty: number,
  numFirms: number,
): string {
  const rate = alphaNE(savings, demandLoss, numFirms, difficulty);
  const s = colored(fmt(savings), COLORS.ORANGE);
  const l = colored(fmt(demandLoss), COLORS.BLUE);
  const n = colored(String(numFirms), COLORS.DARK_GRAY);
  const d = colored(fmt(difficulty), COLORS.PURPLE);
  return `\\text{Free market } a = \\frac{${s} - \\frac{${l}}{${n}}}{${d}} = ${fmt(rate)}`;
}

export function cooperativeFormulaLatex(
  savings: number,
  demandLoss: number,
  difficulty: number,
): string {
  const rate = alphaCO(savings, demandLoss, difficulty);
  const s = colored(fmt(savings), COLORS.ORANGE);
  const l = colored(fmt(demandLoss), COLORS.BLUE);
  const d = colored(fmt(difficulty), COLORS.PURPLE);
  return `\\text{Coordinated } a = \\frac{${s} - ${l}}{${d}} = ${fmt(rate)}`;
}
