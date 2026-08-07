import * as odex from "odex";

type DiffEqFn = (x: number, y: number[]) => number[];
export type DiffEqFactory = (...params: number[]) => DiffEqFn;

interface OdexSolver {
  solve(min: number, initialValues: number[], max: number, grid: unknown): void;
  grid(step: number, cb: (x: number, y: number[]) => void): unknown;
}

interface OdexModule {
  Solver: new (fn: DiffEqFn, n: number, opts: object) => OdexSolver;
}

export function generateData(
  count: number,
  min: number,
  max: number,
  step: number,
  initialValues: number[],
  diffEqValues: number[],
  diffEq: DiffEqFactory,
) {
  const diffEqFn = diffEq(...diffEqValues);
  const s = new (odex as unknown as OdexModule).Solver(diffEqFn, count, {
    denseOutput: true,
    absoluteTolerance: 1e-10,
    relativeTolerance: 1e-10,
  });
  const data: { x: number; y: number }[][] = Array.from(
    { length: count },
    () => [],
  );

  try {
    s.solve(
      min,
      initialValues,
      max,
      s.grid(step, (x: number, y: number[]) => {
        for (let i = 0; i < count; i++) {
          data[i].push({ x, y: y[i] });
        }
      }),
    );
  } catch {
    // Solver can throw when equations blow up (e.g. "maximum allowed steps exceeded").
    // Return whatever data was collected before the divergence.
  }

  return data;
}

export function choices<T>(arr: T[], num: number): T[] {
  return shuffle(arr.slice()).slice(0, num);
}

/**
 * Returns the value of n choose k: n! / (k! * (n-k)!)
 */
export function combinations(n: number, k: number): number {
  if (k > n / 2) return combinations(n, n - k);

  let prod = 1;
  for (let i = 1; i <= k; i++) {
    prod *= (n + 1 - i) / i;
  }

  return prod;
}

/**
 * Restricts a value to the [min, max] range.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Interpolates values between inputs x0 and x1.
 */
export function interpolate(x0: number, x1: number, t: number): number {
  if (t < 0 || t > 1) {
    throw new Error(`Value of t: ${t}. Value must be between 0 and 1.`);
  }
  return x0 * t + x1 * (1 - t);
}

export function euclideanDistance(...pts: number[]): number {
  return pts.reduce((sum, pt) => sum + pt ** 2, 0) ** (1 / 2) || 0;
}

export function total<T>(
  nums: T[],
  accessor: (num: T) => number = (num: T) => num as unknown as number,
): number {
  let sum = 0;
  for (const num of nums) sum += accessor(num);
  return sum;
}

export function average<T>(
  nums: T[],
  accessor: (num: T) => number = (num: T) => num as unknown as number,
): number {
  if (!nums.length) return 0;
  return total(nums, accessor) / nums.length;
}

export function calculateWastedVotes<T>(
  votes: T[],
  party1Accessor: (d: T) => number,
  party2Accessor: (d: T) => number,
): Array<[number, number]> {
  return votes.map((district) => {
    const party1Votes = party1Accessor(district);
    const party2Votes = party2Accessor(district);
    const votesNeededToWin = Math.ceil((party1Votes + party2Votes + 1) / 2);
    return party1Votes > party2Votes
      ? [party1Votes - votesNeededToWin, party2Votes]
      : [party1Votes, party2Votes - votesNeededToWin];
  });
}

export function mod(num: number, base: number): number {
  return ((num % base) + base) % base;
}

function swap<T>(arr: T[], i: number, j: number): T[] {
  [arr[i], arr[j]] = [arr[j], arr[i]];
  return arr;
}

export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i >= 0; i--) {
    const randomIdx = Math.floor(Math.random() * i);
    swap(arr, i, randomIdx);
  }
  return arr;
}

/**
 * Cryptographically secure replacement for Math.random(), returning a float
 * in [0, 1). Math.random() (xorshift128+ in V8) is fine for most UI
 * randomness but is predictable given enough prior outputs; this is a
 * drop-in swap for code that wants a higher-quality source, e.g. simulating
 * fair-odds games of chance.
 */
export function cryptoRandom(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / (0xffffffff + 1);
}
