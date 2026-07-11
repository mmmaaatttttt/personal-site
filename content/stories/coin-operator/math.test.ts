import { describe, expect, it } from "vitest";
import { type SlotResult, SlotValue } from "./data";
import { calculatePayout, calculateProbability } from "./math";

describe("calculatePayout", () => {
  it.each<[SlotResult, number]>([
    [
      [SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_1],
      5,
    ],
    [
      [SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.COIN_3],
      15,
    ],
    [[SlotValue.CROWN, SlotValue.CROWN, SlotValue.CROWN, SlotValue.CROWN], 100],
    [
      [SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.CLOVER],
      40,
    ],
    [
      [SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_3],
      3,
    ],
    [
      [SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.CROWN],
      3,
    ],
    [[SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.DASH], 3],
    [[SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.NET], 3],
    [
      [SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.CLOVER],
      13,
    ],
    [
      [SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.DOUBLE],
      6,
    ],
    [
      [SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.SNAKE],
      0,
    ],
    [
      [SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.COIN_1],
      9,
    ],
    [
      [SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.CROWN],
      9,
    ],
    [[SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.DASH], 9],
    [[SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.NET], 9],
    [
      [SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.CLOVER],
      19,
    ],
    [
      [SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.DOUBLE],
      18,
    ],
    [
      [SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.COIN_3, SlotValue.SNAKE],
      0,
    ],
    [[SlotValue.SNAKE, SlotValue.NET, SlotValue.DASH, SlotValue.CROWN], 3],
    [[SlotValue.SNAKE, SlotValue.NET, SlotValue.DASH, SlotValue.DOUBLE], 6],
    [[SlotValue.SNAKE, SlotValue.NET, SlotValue.DOUBLE, SlotValue.DOUBLE], 12],
    [[SlotValue.SNAKE, SlotValue.NET, SlotValue.NET, SlotValue.NET], 3],
    [[SlotValue.SNAKE, SlotValue.NET, SlotValue.COIN_1, SlotValue.CLOVER], 13],
    [[SlotValue.SNAKE, SlotValue.NET, SlotValue.CLOVER, SlotValue.CLOVER], 23],
    [[SlotValue.SNAKE, SlotValue.NET, SlotValue.SNAKE, SlotValue.CLOVER], 16],
    [[SlotValue.SNAKE, SlotValue.NET, SlotValue.SNAKE, SlotValue.NET], 6],
    [[SlotValue.SNAKE, SlotValue.NET, SlotValue.SNAKE, SlotValue.DASH], 6],
    [[SlotValue.SNAKE, SlotValue.NET, SlotValue.SNAKE, SlotValue.DOUBLE], 12],
    [[SlotValue.SNAKE, SlotValue.NET, SlotValue.CLOVER, SlotValue.DOUBLE], 26],
    [[SlotValue.SNAKE, SlotValue.SNAKE, SlotValue.SNAKE, SlotValue.NET], 9],
    [[SlotValue.SNAKE, SlotValue.SNAKE, SlotValue.SNAKE, SlotValue.SNAKE], 0],
    [[SlotValue.SNAKE, SlotValue.SNAKE, SlotValue.SNAKE, SlotValue.CLOVER], 0],
    [[SlotValue.SNAKE, SlotValue.SNAKE, SlotValue.CLOVER, SlotValue.CLOVER], 0],
    [
      [SlotValue.SNAKE, SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.CLOVER],
      0,
    ],
    [[SlotValue.CLOVER, SlotValue.DASH, SlotValue.DASH, SlotValue.DASH], 10],
    [[SlotValue.CLOVER, SlotValue.DASH, SlotValue.DASH, SlotValue.CROWN], 10],
    [[SlotValue.CLOVER, SlotValue.DASH, SlotValue.CROWN, SlotValue.CROWN], 10],
    [[SlotValue.CLOVER, SlotValue.CROWN, SlotValue.CROWN, SlotValue.CROWN], 10],
    [[SlotValue.CLOVER, SlotValue.COIN_1, SlotValue.COIN_3, SlotValue.NET], 10],
    [[SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.COIN_3, SlotValue.NET], 20],
    [[SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.DASH, SlotValue.DASH], 20],
    [
      [SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.DASH],
      30,
    ],
    [
      [SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.COIN_1],
      30,
    ],
    [
      [SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.COIN_3],
      30,
    ],
    [
      [SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.CROWN],
      30,
    ],
    [[SlotValue.CLOVER, SlotValue.DASH, SlotValue.DASH, SlotValue.DOUBLE], 20],
    [
      [SlotValue.CLOVER, SlotValue.DASH, SlotValue.COIN_1, SlotValue.DOUBLE],
      20,
    ],
    [
      [SlotValue.CLOVER, SlotValue.DASH, SlotValue.COIN_3, SlotValue.DOUBLE],
      20,
    ],
    [
      [SlotValue.CLOVER, SlotValue.CROWN, SlotValue.DOUBLE, SlotValue.DOUBLE],
      40,
    ],
    [
      [SlotValue.CLOVER, SlotValue.DASH, SlotValue.DOUBLE, SlotValue.DOUBLE],
      40,
    ],
    [
      [SlotValue.CLOVER, SlotValue.DOUBLE, SlotValue.DOUBLE, SlotValue.DOUBLE],
      80,
    ],
    [
      [SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.DOUBLE, SlotValue.DASH],
      40,
    ],
    [
      [SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.DOUBLE, SlotValue.DOUBLE],
      80,
    ],
    [
      [SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.CLOVER, SlotValue.DOUBLE],
      60,
    ],
    [[SlotValue.COIN_1, SlotValue.COIN_3, SlotValue.CROWN, SlotValue.DASH], 0],
    [
      [SlotValue.COIN_1, SlotValue.COIN_3, SlotValue.COIN_1, SlotValue.COIN_3],
      0,
    ],
    [[SlotValue.NET, SlotValue.NET, SlotValue.NET, SlotValue.NET], 0],
    [
      [SlotValue.DOUBLE, SlotValue.DOUBLE, SlotValue.DOUBLE, SlotValue.DOUBLE],
      0,
    ],
    [
      [SlotValue.DOUBLE, SlotValue.DOUBLE, SlotValue.COIN_1, SlotValue.COIN_1],
      0,
    ],
    [[SlotValue.DOUBLE, SlotValue.CROWN, SlotValue.CROWN, SlotValue.CROWN], 0],
  ])("calculatePayout(%j) -> %i", (slotResult, expectedPayout) => {
    expect(calculatePayout(slotResult)).toBe(expectedPayout);
  });
});

describe("calculateProbability", () => {
  it.each<[SlotResult, number]>([
    // 4 of same: coefficient = 1
    [
      [SlotValue.DASH, SlotValue.DASH, SlotValue.DASH, SlotValue.DASH],
      0.28 ** 4,
    ],
    [
      [SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_1],
      0.315 ** 4,
    ],
    // 3+1: coefficient = C(4,3)*C(1,1) = 4
    [
      [SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.DASH],
      4 * 0.315 ** 3 * 0.28,
    ],
    [
      [SlotValue.SNAKE, SlotValue.SNAKE, SlotValue.SNAKE, SlotValue.NET],
      4 * 0.1 ** 3 * 0.04,
    ],
    // 2+2: coefficient = C(4,2)*C(2,2) = 6
    [
      [SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.DASH, SlotValue.DASH],
      6 * 0.315 ** 2 * 0.28 ** 2,
    ],
    // 2+1+1: coefficient = C(4,2)*C(2,1)*C(1,1) = 12
    [
      [SlotValue.COIN_1, SlotValue.COIN_1, SlotValue.DASH, SlotValue.CROWN],
      12 * 0.315 ** 2 * 0.28 * 0.08,
    ],
    // 1+1+1+1: coefficient = 4! = 24
    [
      [SlotValue.COIN_1, SlotValue.DASH, SlotValue.CROWN, SlotValue.NET],
      24 * 0.315 * 0.28 * 0.08 * 0.04,
    ],
  ])("calculateProbability(%j) -> %f", (slotResult, expectedProbability) => {
    expect(calculateProbability(slotResult)).toBeCloseTo(
      expectedProbability,
      10,
    );
  });
});
