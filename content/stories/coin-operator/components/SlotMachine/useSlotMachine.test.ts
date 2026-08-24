import { act, renderHook } from "@testing-library/react";
import { animate } from "framer-motion";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSlotMachine } from "./useSlotMachine";

type AnimateOptions = Parameters<typeof animate>[2] & {
  onUpdate?: (v: number) => void;
  onComplete?: () => void;
};

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, animate: vi.fn() };
});

beforeEach(() => {
  localStorage.clear();
  vi.mocked(animate).mockReset();
});

describe("useSlotMachine handlePull", () => {
  it("ignores a pull while a spin is already in progress", () => {
    vi.mocked(animate).mockImplementation((_from, _to, options) => {
      (options as AnimateOptions).onUpdate?.(0.5);
      return { stop: vi.fn() } as unknown as ReturnType<typeof animate>;
    });

    const { result } = renderHook(() => useSlotMachine(0));

    act(() => {
      result.current.handlePull();
    });
    expect(result.current.mainSpinning).toBe(true);
    const callsAfterFirstPull = vi.mocked(animate).mock.calls.length;

    act(() => {
      result.current.handlePull();
    });
    expect(vi.mocked(animate).mock.calls.length).toBe(callsAfterFirstPull);
  });
});

describe("useSlotMachine handleReelClick", () => {
  it("does nothing before a round is pending", () => {
    const { result } = renderHook(() => useSlotMachine(3));

    act(() => {
      result.current.handleReelClick(0);
    });

    expect(result.current.selectedIndex).toBeNull();
  });
});

describe("useSlotMachine handleBonusSpin", () => {
  it("does nothing when no reel is selected", () => {
    const { result } = renderHook(() => useSlotMachine(3));

    act(() => {
      result.current.handleBonusSpin();
    });

    expect(result.current.bonusSpinning).toBe(false);
    expect(animate).not.toHaveBeenCalled();
  });
});
