import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { StandeeData } from "../../data";
import { TICK_INTERVAL_MS } from "./constants";
import { useStandeeCollector } from "./useStandeeCollector";

function fakeStandees(count: number): StandeeData[] {
  return Array.from({ length: count }, (_, i) => ({
    character: "Test",
    pose: `Pose${i}`,
    image: `/images/standees/test_pose${i}.png`,
  }));
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useStandeeCollector", () => {
  it("starts with all-zero tallies, no last-drawn index, and is not finished", () => {
    const { result } = renderHook(() =>
      useStandeeCollector(fakeStandees(5), 1),
    );
    expect(result.current.tallies).toEqual([0, 0, 0, 0, 0]);
    expect(result.current.lastDrawnIndex).toBeNull();
    expect(result.current.isFinished).toBe(false);
    expect(result.current.playing).toBe(false);
  });

  it("marks only the first standee of each character as a starter", () => {
    const { result } = renderHook(() =>
      useStandeeCollector(fakeStandees(5), 1),
    );
    expect(result.current.starterFlags).toEqual([
      true,
      false,
      false,
      false,
      false,
    ]);
  });

  it("draws a standee on each tick while playing and records the last-drawn index", () => {
    const { result } = renderHook(() =>
      useStandeeCollector(fakeStandees(5), 1),
    );
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    const totalDraws = result.current.tallies.reduce((a, b) => a + b, 0);
    expect(totalDraws).toBeGreaterThan(0);
    expect(result.current.lastDrawnIndex).not.toBeNull();
  });

  it("never draws the starter standee (index 0), even after many ticks", () => {
    const { result } = renderHook(() =>
      useStandeeCollector(fakeStandees(5), 1),
    );
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS * 20);
    });
    expect(result.current.tallies[0]).toBe(0);
  });

  it("draws faster at a higher speed", () => {
    const slow = renderHook(() => useStandeeCollector(fakeStandees(100), 1));
    const fast = renderHook(() => useStandeeCollector(fakeStandees(100), 3));
    act(() => {
      slow.result.current.toggle();
      fast.result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    const slowDraws = slow.result.current.tallies.reduce((a, b) => a + b, 0);
    const fastDraws = fast.result.current.tallies.reduce((a, b) => a + b, 0);
    expect(fastDraws).toBeGreaterThan(slowDraws);
  });

  it("stops ticking once paused", () => {
    const { result } = renderHook(() =>
      useStandeeCollector(fakeStandees(5), 1),
    );
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

  it("is already finished when every standee is a starter", () => {
    const { result } = renderHook(() =>
      useStandeeCollector(fakeStandees(1), 1),
    );
    expect(result.current.isFinished).toBe(true);
  });

  it("automatically stops playing once every non-starter standee is found", () => {
    const { result } = renderHook(() =>
      useStandeeCollector(fakeStandees(2), 1),
    );
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    expect(result.current.isFinished).toBe(true);
    expect(result.current.playing).toBe(false);
  });

  it("resets tallies, last-drawn index, and stops playing", () => {
    const { result } = renderHook(() =>
      useStandeeCollector(fakeStandees(2), 1),
    );
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    act(() => {
      result.current.reset();
    });
    expect(result.current.tallies).toEqual([0, 0]);
    expect(result.current.lastDrawnIndex).toBeNull();
    expect(result.current.playing).toBe(false);
  });

  it("resets tallies when standeeData changes", () => {
    const { result, rerender } = renderHook(
      ({ standeeData }) => useStandeeCollector(standeeData, 1),
      { initialProps: { standeeData: fakeStandees(3) } },
    );
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    rerender({ standeeData: fakeStandees(6) });
    expect(result.current.tallies).toEqual([0, 0, 0, 0, 0, 0]);
    expect(result.current.lastDrawnIndex).toBeNull();
    expect(result.current.playing).toBe(false);
  });

  it("stops the tick loop on unmount without throwing", () => {
    const { result, unmount } = renderHook(() =>
      useStandeeCollector(fakeStandees(5), 1),
    );
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
