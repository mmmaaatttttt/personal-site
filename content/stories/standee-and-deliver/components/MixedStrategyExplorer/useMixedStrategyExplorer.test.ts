import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { writeMemoryItem } from "@/hooks/useMemoryStore";
import {
  DEFAULT_GUARANTEED_MULTIPLIER,
  DEFAULT_RANDOM_COST,
  GUARANTEED_MULTIPLIER_KEY,
  RANDOM_COST_KEY,
  SWITCH_POINT_KEY,
} from "../../sliderStore";
import { TICK_INTERVAL_MS } from "./constants";
import { useMixedStrategyExplorer } from "./useMixedStrategyExplorer";

const NUM_STANDEES = 20;

beforeEach(() => {
  vi.useFakeTimers();
  writeMemoryItem(RANDOM_COST_KEY, DEFAULT_RANDOM_COST);
  writeMemoryItem(GUARANTEED_MULTIPLIER_KEY, DEFAULT_GUARANTEED_MULTIPLIER);
  writeMemoryItem(SWITCH_POINT_KEY, Math.round(NUM_STANDEES / 2));
});

afterEach(() => {
  vi.useRealTimers();
});

function findSlider<T extends { key?: string | number }>(
  sliderData: T[],
  key: string,
): T {
  const slider = sliderData.find((d) => d.key === key);
  if (!slider) throw new Error(`Missing slider for key ${key}`);
  return slider;
}

describe("useMixedStrategyExplorer", () => {
  it("starts from nothing owned, with zero cost/draws so far", () => {
    const { result } = renderHook(() => useMixedStrategyExplorer(NUM_STANDEES));
    expect(result.current.tallies.filter((t) => t > 0)).toHaveLength(0);
    expect(result.current.totalCost).toBe(0);
    expect(result.current.totalDraws).toBe(0);
  });

  it("defaults the switch point to the midpoint, editable via its own slider", () => {
    const { result } = renderHook(() => useMixedStrategyExplorer(NUM_STANDEES));
    const slider = findSlider(result.current.settingsSliderData, "switchPoint");
    expect(slider.value).toBe(Math.round(NUM_STANDEES / 2));
  });

  it("accumulates cost and draws as it plays out", () => {
    const { result } = renderHook(() => useMixedStrategyExplorer(NUM_STANDEES));
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    expect(result.current.totalCost).toBeGreaterThan(0);
    expect(result.current.totalDraws).toBeGreaterThan(0);
  });

  it("clamps the switch-point slider to numStandees", () => {
    const { result } = renderHook(() => useMixedStrategyExplorer(NUM_STANDEES));
    act(() => {
      findSlider(
        result.current.settingsSliderData,
        "switchPoint",
      ).handleValueChange(NUM_STANDEES + 100);
    });
    const slider = findSlider(result.current.settingsSliderData, "switchPoint");
    expect(slider.value).toBe(NUM_STANDEES);
  });

  it("only spends guaranteed coins when the switch point is set to 0", () => {
    const { result } = renderHook(() => useMixedStrategyExplorer(NUM_STANDEES));
    act(() => {
      findSlider(
        result.current.settingsSliderData,
        "switchPoint",
      ).handleValueChange(0);
    });
    act(() => {
      findSlider(
        result.current.settingsSliderData,
        "randomCost",
      ).handleValueChange(7);
    });
    act(() => {
      result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    // guaranteedCost defaults to 3x randomCost=7, i.e. 21 per draw. If every
    // draw went guaranteed (switch point 0 means guaranteed from the very
    // first purchase), total cost is an exact multiple of 21.
    expect(result.current.totalDraws).toBeGreaterThan(0);
    expect(result.current.totalCost).toBe(result.current.totalDraws * 21);
  });

  it("exposes an editable speed slider that speeds up drawing", () => {
    const slow = renderHook(() => useMixedStrategyExplorer(100));
    const fast = renderHook(() => useMixedStrategyExplorer(100));
    act(() => {
      findSlider(
        fast.result.current.speedSliderData,
        "speed",
      ).handleValueChange(3);
    });
    act(() => {
      slow.result.current.toggle();
      fast.result.current.toggle();
    });
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    expect(fast.result.current.totalCost).toBeGreaterThan(
      slow.result.current.totalCost,
    );
  });
});
