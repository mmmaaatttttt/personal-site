import { PROBABILITY_MAP, type SlotResult, SlotValue, SPIN_COST } from "./data";
import {
  calculatePayout,
  calculateProbability,
  enumerateSlotResults,
} from "./math";

const ALL_SYMBOLS = Object.values(SlotValue) as SlotValue[];

export interface StrategyResult {
  value: number;
  action: "stay" | SlotValue;
}

export interface ActionValues {
  stay: number;
  spin: Partial<Record<SlotValue, number>>;
}

const strategyMemo = new Map<number, StrategyResult>();

// Numeric 0-7 code per symbol, so state keys can be packed into a single
// integer instead of built via array-sort + string-join. Integer Map keys
// also hash far cheaper in V8 than string keys.
const SYMBOL_CODE = Object.fromEntries(
  ALL_SYMBOLS.map((symbol, i) => [symbol, i]),
) as Record<SlotValue, number>;

/**
 * Encodes (sorted multiset of `state`, `spinsRemaining`) as a single
 * integer: each symbol is a 3-bit code (0-7), sorted with a fixed
 * compare-swap network (no array allocation, unlike `.sort()`), packed into
 * 12 bits, then combined with `spinsRemaining` in the low 12 bits. This is
 * on the hottest path in the DP below — called for every recursive step,
 * including cache hits — so avoiding allocation here matters.
 */
function stateKey(state: SlotResult, spinsRemaining: number): number {
  let a = SYMBOL_CODE[state[0]];
  let b = SYMBOL_CODE[state[1]];
  let c = SYMBOL_CODE[state[2]];
  let d = SYMBOL_CODE[state[3]];

  if (a > b) {
    const t = a;
    a = b;
    b = t;
  }
  if (c > d) {
    const t = c;
    c = d;
    d = t;
  }
  if (a > c) {
    const t = a;
    a = c;
    c = t;
  }
  if (b > d) {
    const t = b;
    b = d;
    d = t;
  }
  if (b > c) {
    const t = b;
    b = c;
    c = t;
  }

  const symbolBits = (a << 9) | (b << 6) | (c << 3) | d;
  return (symbolBits << 12) | spinsRemaining;
}

/** The three symbols of `state` other than the one at `idx`, in their
 *  original relative order — avoids the allocation-heavy
 *  `[...state.slice(0, idx), ...state.slice(idx + 1)]`. */
function withoutIndex(
  state: SlotResult,
  idx: number,
): [SlotValue, SlotValue, SlotValue] {
  if (idx === 0) return [state[1], state[2], state[3]];
  if (idx === 1) return [state[0], state[2], state[3]];
  if (idx === 2) return [state[0], state[1], state[3]];
  return [state[0], state[1], state[2]];
}

/**
 * Shared shape for "what's the value of staying, and of respinning each
 * distinct symbol present" — used by both the optimal-play model
 * (`evaluateActions`, continuing via `optimalStrategy`) and the
 * bounded-rational model (continuing via `boundedRationalValue`). The two
 * models only differ in how they turn these per-action values into a single
 * number, so that step is left to the caller via `continuation`.
 */
function computeActionValues(
  state: SlotResult,
  spinsRemaining: number,
  continuation: (nextState: SlotResult, spinsRemaining: number) => number,
): ActionValues {
  const stay = calculatePayout(state);
  const spin: Partial<Record<SlotValue, number>> = {};

  if (spinsRemaining > 0) {
    for (let idx = 0; idx < state.length; idx++) {
      const symbol = state[idx];
      // Respinning any slot holding `symbol` is equivalent, so only handle
      // each distinct symbol once — at its first occurrence in `state`.
      let seenEarlier = false;
      for (let j = 0; j < idx; j++) {
        if (state[j] === symbol) {
          seenEarlier = true;
          break;
        }
      }
      if (seenEarlier) continue;

      const rest = withoutIndex(state, idx);

      let value = -SPIN_COST;
      for (const candidate of ALL_SYMBOLS) {
        const probability = PROBABILITY_MAP[candidate];
        if (probability === 0) continue;

        const nextState: SlotResult = [rest[0], rest[1], rest[2], candidate];
        value += probability * continuation(nextState, spinsRemaining - 1);
      }

      spin[symbol] = value;
    }
  }

  return { stay, spin };
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
  return computeActionValues(
    state,
    spinsRemaining,
    (nextState, remaining) => optimalStrategy(nextState, remaining).value,
  );
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

/**
 * Expected value of the machine when the player may take up to
 * `spinsRemaining` optimal bonus spins after the initial pull, net of the
 * cost of that initial pull too (the `-1` seed). So `machineExpectedValue(0)`
 * equals the plain (0-bonus-spin) `expectedValue` used elsewhere in the
 * article, minus 1.
 */
export function machineExpectedValue(spinsRemaining: number): number {
  return enumerateSlotResults().reduce(
    (sum, result) =>
      sum +
      calculateProbability(result) *
        optimalStrategy(result, spinsRemaining).value,
    -1,
  );
}

/** `machineExpectedValue` evaluated at every spin count from 0 to
 *  `maxSpinsRemaining`, inclusive — for charting the convergence curve. */
export function machineExpectedValueCurve(maxSpinsRemaining: number): number[] {
  const curve: number[] = [];
  for (let n = 0; n <= maxSpinsRemaining; n++) {
    curve.push(machineExpectedValue(n));
  }
  return curve;
}

/**
 * Turns a list of action values into a probability distribution over those
 * actions under a softmax ("quantal response") choice policy at the given
 * `temperature`: `P(action) ∝ exp(value / temperature)`. Lower temperature
 * concentrates probability on the best action (0 collapses to a hard
 * argmax, matching `optimalStrategy`); higher temperature spreads
 * probability more evenly across all actions (`Infinity` is uniform,
 * ignoring value entirely).
 */
export function softmaxProbabilities(
  values: number[],
  temperature: number,
): number[] {
  if (temperature <= 0) {
    const maxValue = Math.max(...values);
    const bestIndex = values.indexOf(maxValue);
    return values.map((_, i) => (i === bestIndex ? 1 : 0));
  }
  if (!Number.isFinite(temperature)) {
    return values.map(() => 1 / values.length);
  }

  // Subtract the max before exponentiating so large values don't overflow.
  const maxValue = Math.max(...values);
  const weights = values.map((v) => Math.exp((v - maxValue) / temperature));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  return weights.map((w) => w / totalWeight);
}

/**
 * Turns a list of action values into a single probability-weighted value,
 * via `softmaxProbabilities` at the given `temperature`.
 */
export function softmaxWeightedValue(
  values: number[],
  temperature: number,
): number {
  const probabilities = softmaxProbabilities(values, temperature);
  return values.reduce((sum, v, i) => sum + probabilities[i] * v, 0);
}

/**
 * Like `optimalStrategy(state, spinsRemaining).value`, but modeling a
 * boundedly-rational player: at *every* decision (not just this one), the
 * player picks according to the softmax policy at `temperature` rather than
 * always taking the best action. `memo` is supplied by the caller
 * (`boundedRationalExpectedValueCurve`) and shared across an entire curve
 * computation — unlike `optimalStrategy`'s module-level cache, results here
 * depend on `temperature`, which changes on every slider tick, so a
 * long-lived global cache would just accumulate unreused entries.
 */
function boundedRationalValue(
  state: SlotResult,
  spinsRemaining: number,
  temperature: number,
  memo: Map<number, number>,
): number {
  const key = stateKey(state, spinsRemaining);
  const cached = memo.get(key);
  if (cached !== undefined) return cached;

  const { stay, spin } = computeActionValues(
    state,
    spinsRemaining,
    (nextState, remaining) =>
      boundedRationalValue(nextState, remaining, temperature, memo),
  );

  const result = softmaxWeightedValue(
    [stay, ...Object.values(spin)],
    temperature,
  );

  memo.set(key, result);
  return result;
}

/**
 * Like `evaluateActions`, but for a boundedly-rational player: every future
 * decision (not just this one) is also assumed to follow the softmax policy
 * at `temperature`, rather than always taking the best action. Uses its own
 * fresh memo per call rather than sharing `optimalStrategy`'s module-level
 * cache, since results here depend on `temperature`.
 */
export function boundedRationalActionValues(
  state: SlotResult,
  spinsRemaining: number,
  temperature: number,
): ActionValues {
  const memo = new Map<number, number>();
  return computeActionValues(state, spinsRemaining, (nextState, remaining) =>
    boundedRationalValue(nextState, remaining, temperature, memo),
  );
}

/**
 * `boundedRationalValue`'s machine-wide expected value (same net-of-initial-
 * coin framing as `machineExpectedValue`), evaluated at every spin count
 * from 0 to `maxSpinsRemaining`. A single memo is shared across the whole
 * curve so per-state work at each depth is computed once, not once per `n`.
 */
export function boundedRationalExpectedValueCurve(
  maxSpinsRemaining: number,
  temperature: number,
): number[] {
  const memo = new Map<number, number>();
  const results = enumerateSlotResults();

  const curve: number[] = [];
  for (let n = 0; n <= maxSpinsRemaining; n++) {
    curve.push(
      results.reduce(
        (sum, result) =>
          sum +
          calculateProbability(result) *
            boundedRationalValue(result, n, temperature, memo),
        -1,
      ),
    );
  }
  return curve;
}
