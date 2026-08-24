import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    animate: vi.fn(
      (
        _from: number,
        to: number,
        options?: { onUpdate?: (v: number) => void },
      ) => {
        options?.onUpdate?.(to);
        return { stop: vi.fn() };
      },
    ),
  };
});

import { useBonusSpinEvChart } from "./useBonusSpinEvChart";

const SLOW_TEST_TIMEOUT = 20000;

describe("useBonusSpinEvChart", () => {
  it(
    "animates the bounded curve's pixel positions to match yScale",
    () => {
      const { result } = renderHook(() => useBonusSpinEvChart());

      act(() => {});

      const { boundedCurve, animatedBoundedY, yScale } = result.current;
      expect(animatedBoundedY).toEqual(
        boundedCurve.map((value) => yScale(value)),
      );
    },
    SLOW_TEST_TIMEOUT,
  );
});
