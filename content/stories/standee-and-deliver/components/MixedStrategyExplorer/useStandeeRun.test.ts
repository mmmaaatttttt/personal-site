import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TICK_INTERVAL_MS } from "./constants";
import { useStandeeRun } from "./useStandeeRun";

vi.mock("../../utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../utils")>();
  return {
    ...actual,
    pickInitialOwned: vi.fn((numStandees: number, alreadyOwned: number) => {
      const owned = new Array(numStandees).fill(false);
      for (let i = 0; i < alreadyOwned; i++) owned[i] = true;
      return owned;
    }),
  };
});

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useStandeeRun", () => {
  it("starts with all-zero tallies, no last-drawn index, and no draws of either kind when nothing is owned", () => {
    const { result } = renderHook(() => useStandeeRun(5, 0, 5, 1));
    expect(result.current.tallies).toEqual([0, 0, 0, 0, 0]);
    expect(result.current.lastDrawnIndex).toBeNull();
    expect(result.current.randomDraws).toBe(0);
    expect(result.current.guaranteedDraws).toBe(0);
    expect(result.current.isFinished).toBe(false);
  });

  it("seeds tallies for already-owned standees without counting them as draws", () => {
    const { result } = renderHook(() => useStandeeRun(5, 2, 5, 1));
    expect(result.current.tallies).toEqual([1, 1, 0, 0, 0]);
    expect(result.current.randomDraws).toBe(0);
    expect(result.current.guaranteedDraws).toBe(0);
  });

  it("counts guaranteed draws and records the last-drawn index under a guaranteed-only strategy (switchStrategyAfter = 0)", () => {
    const { result } = renderHook(() => useStandeeRun(1, 0, 0, 1));
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    expect(result.current.guaranteedDraws).toBe(1);
    expect(result.current.randomDraws).toBe(0);
    expect(result.current.lastDrawnIndex).toBe(0);
    expect(result.current.isFinished).toBe(true);
    expect(result.current.playing).toBe(false);
  });

  it("counts random draws under a random-only strategy (switchStrategyAfter = numStandees)", () => {
    const { result } = renderHook(() => useStandeeRun(5, 0, 5, 1));
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    expect(result.current.randomDraws).toBeGreaterThan(0);
    expect(result.current.guaranteedDraws).toBe(0);
  });

  it("draws faster at a higher speed", () => {
    const slow = renderHook(() => useStandeeRun(100, 0, 100, 1));
    const fast = renderHook(() => useStandeeRun(100, 0, 100, 3));
    act(() => {
      slow.result.current.toggle();
      fast.result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    expect(fast.result.current.randomDraws).toBeGreaterThan(
      slow.result.current.randomDraws,
    );
  });

  it("stops ticking once paused", () => {
    const { result } = renderHook(() => useStandeeRun(5, 0, 5, 1));
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    act(() => {
      result.current.toggle();
    });
    const talliesAfterPause = result.current.tallies;
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS * 5);
    });
    expect(result.current.tallies).toEqual(talliesAfterPause);
  });

  it("resets tallies, draw counts, and last-drawn index", () => {
    const { result } = renderHook(() => useStandeeRun(1, 0, 0, 1));
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    act(() => {
      result.current.reset();
    });
    expect(result.current.tallies).toEqual([0]);
    expect(result.current.lastDrawnIndex).toBeNull();
    expect(result.current.guaranteedDraws).toBe(0);
    expect(result.current.playing).toBe(false);
  });

  it("resets when numStandees changes", () => {
    const { result, rerender } = renderHook(
      ({ numStandees, alreadyOwned, switchStrategyAfter, speed }) =>
        useStandeeRun(numStandees, alreadyOwned, switchStrategyAfter, speed),
      {
        initialProps: {
          numStandees: 3,
          alreadyOwned: 0,
          switchStrategyAfter: 0,
          speed: 1,
        },
      },
    );
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    rerender({
      numStandees: 6,
      alreadyOwned: 0,
      switchStrategyAfter: 0,
      speed: 1,
    });
    expect(result.current.tallies).toEqual([0, 0, 0, 0, 0, 0]);
    expect(result.current.lastDrawnIndex).toBeNull();
    expect(result.current.playing).toBe(false);
  });

  it("resets when alreadyOwned changes", () => {
    const { result, rerender } = renderHook(
      ({ numStandees, alreadyOwned, switchStrategyAfter, speed }) =>
        useStandeeRun(numStandees, alreadyOwned, switchStrategyAfter, speed),
      {
        initialProps: {
          numStandees: 5,
          alreadyOwned: 0,
          switchStrategyAfter: 5,
          speed: 1,
        },
      },
    );
    rerender({
      numStandees: 5,
      alreadyOwned: 3,
      switchStrategyAfter: 5,
      speed: 1,
    });
    expect(result.current.tallies).toEqual([1, 1, 1, 0, 0]);
  });

  it("stops the tick loop on unmount without throwing", () => {
    const { result, unmount } = renderHook(() => useStandeeRun(5, 0, 5, 1));
    act(() => {
      result.current.toggle();
    });
    expect(() => {
      unmount();
      act(() => {
        vi.advanceTimersByTime(TICK_INTERVAL_MS * 5);
      });
    }).not.toThrow();
  });
});
