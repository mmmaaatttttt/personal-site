import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTickLoop } from "./useTickLoop";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useTickLoop", () => {
  it("starts not playing and never calls onTick", () => {
    const onTick = vi.fn();
    const { result } = renderHook(() =>
      useTickLoop({ tickIntervalMs: 100, onTick }),
    );
    expect(result.current.playing).toBe(false);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onTick).not.toHaveBeenCalled();
  });

  it("calls onTick once toggled on, once the interval has elapsed", () => {
    const onTick = vi.fn();
    const { result } = renderHook(() =>
      useTickLoop({ tickIntervalMs: 100, onTick }),
    );
    act(() => {
      result.current.toggle();
    });
    expect(result.current.playing).toBe(true);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(onTick).toHaveBeenCalled();
  });

  it("does not call onTick before the interval has elapsed", () => {
    const onTick = vi.fn();
    const { result } = renderHook(() =>
      useTickLoop({ tickIntervalMs: 1000, onTick }),
    );
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(onTick).not.toHaveBeenCalled();
  });

  it("stops calling onTick once toggled off", () => {
    const onTick = vi.fn();
    const { result } = renderHook(() =>
      useTickLoop({ tickIntervalMs: 100, onTick }),
    );
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    act(() => {
      result.current.toggle();
    });
    expect(result.current.playing).toBe(false);
    const callsAtPause = onTick.mock.calls.length;
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onTick.mock.calls.length).toBe(callsAtPause);
  });

  it("stop() halts playing and further ticks", () => {
    const onTick = vi.fn();
    const { result } = renderHook(() =>
      useTickLoop({ tickIntervalMs: 100, onTick }),
    );
    act(() => {
      result.current.toggle();
    });
    act(() => {
      result.current.stop();
    });
    expect(result.current.playing).toBe(false);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onTick).not.toHaveBeenCalled();
  });

  it("uses the latest onTick even when it isn't memoized by the caller", () => {
    const firstOnTick = vi.fn();
    const secondOnTick = vi.fn();
    const { result, rerender } = renderHook(
      ({ onTick }) => useTickLoop({ tickIntervalMs: 100, onTick }),
      { initialProps: { onTick: firstOnTick } },
    );
    rerender({ onTick: secondOnTick });
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(firstOnTick).not.toHaveBeenCalled();
    expect(secondOnTick).toHaveBeenCalled();
  });

  it("uses the latest tickIntervalMs even after play has already started", () => {
    const onTick = vi.fn();
    const { result, rerender } = renderHook(
      ({ tickIntervalMs }) => useTickLoop({ tickIntervalMs, onTick }),
      { initialProps: { tickIntervalMs: 1000 } },
    );
    act(() => {
      result.current.toggle();
    });
    rerender({ tickIntervalMs: 10 });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(onTick).toHaveBeenCalled();
  });

  it("stops the tick loop on unmount without throwing", () => {
    const onTick = vi.fn();
    const { result, unmount } = renderHook(() =>
      useTickLoop({ tickIntervalMs: 100, onTick }),
    );
    act(() => {
      result.current.toggle();
    });
    expect(() => {
      unmount();
      act(() => {
        vi.advanceTimersByTime(500);
      });
    }).not.toThrow();
  });
});
