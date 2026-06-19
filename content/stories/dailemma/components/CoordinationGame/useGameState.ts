import COLORS from "@/utils/styles";
import { pdPayoffs } from "../../math";

const ZERO_THRESHOLD = 0.005;

type Cell = { a: number; b: number };

export interface GameState {
  cells: Cell[][];
  isNE: (r: number, c: number) => boolean;
  isParetoOptimal: (r: number, c: number) => boolean;
  gameLabel: string;
  gameLabelColor: string;
}

export function useGameState(savings: number, demandLoss: number): GameState {
  const payoffs = pdPayoffs(savings, demandLoss);
  const automateIsDominant = savings > demandLoss / 2;
  const isPD = automateIsDominant && savings < demandLoss;

  const neRow = automateIsDominant ? 0 : 1;
  const neCol = automateIsDominant ? 0 : 1;

  const cells: Cell[][] = [
    [
      { a: payoffs.bothAutomate, b: payoffs.bothAutomate },
      { a: payoffs.automate, b: payoffs.donot },
    ],
    [
      { a: payoffs.donot, b: payoffs.automate },
      { a: payoffs.neitherAutomates, b: payoffs.neitherAutomates },
    ],
  ];

  const isNE = (r: number, c: number) => r === neRow && c === neCol;
  const isParetoOptimal = (r: number, c: number) => isPD && r === 1 && c === 1;

  let gameLabel: string;
  let gameLabelColor: string;
  if (isPD) {
    gameLabel =
      "Prisoner's Dilemma: automating is individually rational, but mutual automation leaves both firms worse off.";
    gameLabelColor = COLORS.RED;
  } else if (automateIsDominant) {
    gameLabel = "No dilemma: both firms automate and both benefit.";
    gameLabelColor = COLORS.DARK_GREEN;
  } else {
    gameLabel =
      "Restraint is dominant: neither firm finds automation profitable enough.";
    gameLabelColor = COLORS.BLUE;
  }

  return { cells, isNE, isParetoOptimal, gameLabel, gameLabelColor };
}

export function payoffColor(v: number): string {
  if (v > ZERO_THRESHOLD) return COLORS.DARK_GREEN;
  if (v < -ZERO_THRESHOLD) return COLORS.RED;
  return COLORS.DARK_GRAY;
}
