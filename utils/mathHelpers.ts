import * as odex from "odex";

export function generateData(
  count: number,
  min: number,
  max: number,
  step: number,
  initialValues: number[],
  diffEqValues: any[],
  diffEq: (...args: any[]) => any
) {
  const diffEqFn = diffEq(...diffEqValues);
  const s = new (odex as any).Solver(diffEqFn, count, {
    denseOutput: true,
    absoluteTolerance: 1e-10,
    relativeTolerance: 1e-10,
  });
  const data: { x: number; y: number }[][] = Array.from({ length: count }, () => []);

  s.solve(min, initialValues, max, s.grid(step, (x: number, y: number[]) => {
    for (let i = 0; i < count; i++) {
      data[i].push({ x, y: y[i] });
    }
  }));

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

export function total<T>(nums: T[], accessor: (num: T) => number = (num: any) => num): number {
  let sum = 0;
  for (let num of nums) sum += accessor(num);
  return sum;
}

export function average<T>(nums: T[], accessor: (num: T) => number = (num: any) => num): number {
  if (!nums.length) return 0;
  return total(nums, accessor) / nums.length;
}

export function calculateWastedVotes<T>(
  votes: T[],
  party1Accessor: (d: T) => number,
  party2Accessor: (d: T) => number
): Array<[number, number]> {
  return votes.map((district) => {
    let party1Votes = party1Accessor(district);
    let party2Votes = party2Accessor(district);
    let votesNeededToWin = Math.ceil((party1Votes + party2Votes + 1) / 2);
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
  for (var i = arr.length - 1; i >= 0; i--) {
    var randomIdx = Math.floor(Math.random() * i);
    swap(arr, i, randomIdx);
  }
  return arr;
}
