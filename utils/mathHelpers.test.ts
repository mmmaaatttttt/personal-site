import * as odex from "odex";
import { describe, expect, it, vi } from "vitest";
import {
  average,
  calculateWastedVotes,
  choices,
  clamp,
  combinations,
  cryptoRandom,
  euclideanDistance,
  generateData,
  interpolate,
  mod,
  shuffle,
  total,
} from "./mathHelpers";

vi.mock("odex", () => ({
  Solver: vi.fn().mockImplementation(
    class {
      grid: ReturnType<typeof vi.fn>;
      solve: ReturnType<typeof vi.fn>;

      constructor(_fn: unknown, count: number) {
        this.grid = vi.fn(
          (_step: number, cb: (x: number, y: number[]) => void) => {
            cb(
              0,
              Array.from({ length: count }, (_, i) => i),
            );
            cb(
              1,
              Array.from({ length: count }, (_, i) => i + 1),
            );
            return "grid-result";
          },
        );
        this.solve = vi.fn();
      }
    } as never,
  ),
}));

describe("generateData", () => {
  const diffEq = () => (_x: number, y: number[]) => y;

  it("returns one array per variable with data points", () => {
    const data = generateData(2, 0, 1, 0.1, [0, 0], [1, 1], diffEq);
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]);
    expect(data[1]).toEqual([
      { x: 0, y: 1 },
      { x: 1, y: 2 },
    ]);
  });

  it("returns partial data when the solver throws", () => {
    vi.mocked(odex.Solver).mockImplementationOnce(
      class {
        grid: ReturnType<typeof vi.fn>;
        solve: ReturnType<typeof vi.fn>;

        constructor(_fn: unknown, count: number) {
          this.grid = vi.fn(
            (_step: number, cb: (x: number, y: number[]) => void) => {
              cb(
                0,
                Array.from({ length: count }, (_, i) => i),
              );
              return "grid-result";
            },
          );
          this.solve = vi.fn(() => {
            throw new Error("maximum allowed steps exceeded");
          });
        }
      } as never,
    );

    const data = generateData(2, 0, 1, 0.1, [0, 0], [1, 1], diffEq);
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual([{ x: 0, y: 0 }]);
    expect(data[1]).toEqual([{ x: 0, y: 1 }]);
  });
});

describe("combinations", () => {
  it("computes n choose k", () => {
    expect(combinations(5, 2)).toBe(10);
    expect(combinations(6, 3)).toBe(20);
    expect(combinations(10, 1)).toBe(10);
  });

  it("handles k === 0", () => {
    expect(combinations(5, 0)).toBe(1);
  });

  it("is symmetric: n choose k === n choose n-k", () => {
    expect(combinations(8, 3)).toBe(combinations(8, 5));
  });
});

describe("clamp", () => {
  it("returns the value unchanged when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to the minimum when below range", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps to the maximum when above range", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("handles boundary values", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe("interpolate", () => {
  it("returns x1 at t=0", () => {
    expect(interpolate(10, 20, 0)).toBe(20);
  });

  it("returns x0 at t=1", () => {
    expect(interpolate(10, 20, 1)).toBe(10);
  });

  it("interpolates midpoint at t=0.5", () => {
    expect(interpolate(10, 20, 0.5)).toBe(15);
  });

  it("throws for t outside [0, 1]", () => {
    expect(() => interpolate(0, 1, -0.1)).toThrow();
    expect(() => interpolate(0, 1, 1.1)).toThrow();
  });
});

describe("euclideanDistance", () => {
  it("computes the norm of a vector", () => {
    expect(euclideanDistance(3, 4)).toBe(5);
  });

  it("returns 0 for all-zero inputs", () => {
    expect(euclideanDistance(0, 0, 0)).toBe(0);
  });

  it("works with a single value", () => {
    expect(euclideanDistance(5)).toBe(5);
  });
});

describe("total", () => {
  it("sums an array of numbers", () => {
    expect(total([1, 2, 3, 4])).toBe(10);
  });

  it("uses the accessor when provided", () => {
    expect(total([{ v: 2 }, { v: 3 }], (d) => d.v)).toBe(5);
  });

  it("returns 0 for empty array", () => {
    expect(total([])).toBe(0);
  });
});

describe("average", () => {
  it("computes the mean", () => {
    expect(average([1, 2, 3])).toBe(2);
  });

  it("uses the accessor when provided", () => {
    expect(average([{ v: 4 }, { v: 8 }], (d) => d.v)).toBe(6);
  });

  it("returns 0 for empty array", () => {
    expect(average([])).toBe(0);
  });
});

describe("calculateWastedVotes", () => {
  it("computes wasted votes when party1 wins", () => {
    const result = calculateWastedVotes(
      [{ p1: 60, p2: 40 }],
      (d) => d.p1,
      (d) => d.p2,
    );
    // votesNeededToWin = ceil((100 + 1) / 2) = 51
    // party1 wasted = 60 - 51 = 9, party2 wasted = 40
    expect(result).toEqual([[9, 40]]);
  });

  it("computes wasted votes when party2 wins", () => {
    const result = calculateWastedVotes(
      [{ p1: 40, p2: 60 }],
      (d) => d.p1,
      (d) => d.p2,
    );
    // votesNeededToWin = ceil(101 / 2) = 51
    // party1 wasted = 40, party2 wasted = 60 - 51 = 9
    expect(result).toEqual([[40, 9]]);
  });

  it("handles multiple districts", () => {
    const result = calculateWastedVotes(
      [
        { p1: 60, p2: 40 },
        { p1: 30, p2: 70 },
      ],
      (d) => d.p1,
      (d) => d.p2,
    );
    expect(result).toHaveLength(2);
  });
});

describe("mod", () => {
  it("returns positive remainder for positive numbers", () => {
    expect(mod(7, 3)).toBe(1);
  });

  it("returns positive remainder for negative numbers", () => {
    expect(mod(-1, 4)).toBe(3);
  });

  it("returns 0 when evenly divisible", () => {
    expect(mod(6, 3)).toBe(0);
  });
});

describe("shuffle", () => {
  it("returns an array with the same elements", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle([...arr]);
    expect(result).toHaveLength(arr.length);
    expect(result.sort()).toEqual(arr.sort());
  });

  it("mutates and returns the same array reference", () => {
    const arr = [1, 2, 3];
    const result = shuffle(arr);
    expect(result).toBe(arr);
  });
});

describe("choices", () => {
  it("returns the requested number of elements", () => {
    const result = choices([1, 2, 3, 4, 5], 3);
    expect(result).toHaveLength(3);
  });

  it("returns elements from the original array", () => {
    const arr = [10, 20, 30];
    const result = choices(arr, 2);
    expect(result.every((v) => arr.includes(v))).toBe(true);
  });

  it("does not mutate the original array", () => {
    const arr = [1, 2, 3, 4];
    choices(arr, 2);
    expect(arr).toHaveLength(4);
  });
});

describe("cryptoRandom", () => {
  it("returns a float in [0, 1)", () => {
    for (let i = 0; i < 20; i++) {
      const value = cryptoRandom();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("does not return the same value on consecutive calls", () => {
    const values = new Set(Array.from({ length: 10 }, () => cryptoRandom()));
    expect(values.size).toBeGreaterThan(1);
  });
});
