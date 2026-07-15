import { PROBABILITY_MAP, type SlotResult, SlotValue, SPIN_COST } from "./data";
import { calculatePayout } from "./math";

const ALL_SYMBOLS = Object.values(SlotValue) as SlotValue[];

export interface StrategyResult {
  value: number;
  action: "stay" | SlotValue;
}

export interface ActionValues {
  stay: number;
  spin: Partial<Record<SlotValue, number>>;
}

const strategyMemo = new Map<string, StrategyResult>();

function stateKey(state: SlotResult, spinsRemaining: number): string {
  return `${[...state].sort().join(",")}|${spinsRemaining}`;
}

/**
 * Respinning any one slot that holds a given symbol is equivalent to
 * respinning any other slot holding that same symbol — the payout only
 * depends on the resulting multiset, not which physical slot changed. So
 * actions are keyed by distinct symbol present, not by slot index.
 */
export function evaluateActions(
  state: SlotResult,
  spinsRemaining: number,
): ActionValues {
  const stay = calculatePayout(state);
  const spin: Partial<Record<SlotValue, number>> = {};

  if (spinsRemaining > 0) {
    const distinctSymbols = Array.from(new Set(state));

    for (const symbol of distinctSymbols) {
      const idx = state.indexOf(symbol);
      const rest = [...state.slice(0, idx), ...state.slice(idx + 1)];

      let value = -SPIN_COST;
      for (const candidate of ALL_SYMBOLS) {
        const probability = PROBABILITY_MAP[candidate];
        if (probability === 0) continue;

        const nextState = [...rest, candidate] as SlotResult;
        value +=
          probability * optimalStrategy(nextState, spinsRemaining - 1).value;
      }

      spin[symbol] = value;
    }
  }

  return { stay, spin };
}

export function optimalStrategy(
  state: SlotResult,
  spinsRemaining: number,
): StrategyResult {
  const key = stateKey(state, spinsRemaining);
  const cached = strategyMemo.get(key);
  if (cached) return cached;

  const { stay, spin } = evaluateActions(state, spinsRemaining);

  let best: StrategyResult = { value: stay, action: "stay" };
  for (const [symbol, value] of Object.entries(spin) as [SlotValue, number][]) {
    if (value > best.value) {
      best = { value, action: symbol };
    }
  }

  strategyMemo.set(key, best);
  return best;
}
