import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useScrollThreshold } from "./useScrollThreshold";

function setScrollMetrics({
  scrollHeight,
  innerHeight,
  scrollY,
}: {
  scrollHeight: number;
  innerHeight: number;
  scrollY: number;
}) {
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: innerHeight,
  });
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY,
  });
}

afterEach(() => {
  setScrollMetrics({ scrollHeight: 0, innerHeight: 0, scrollY: 0 });
});

describe("useScrollThreshold", () => {
  it("returns false before the threshold is reached", () => {
    setScrollMetrics({ scrollHeight: 2000, innerHeight: 800, scrollY: 100 });
    const { result } = renderHook(() => useScrollThreshold(0.5));
    expect(result.current).toBe(false);
  });

  it("returns true once scroll position passes the threshold", () => {
    setScrollMetrics({ scrollHeight: 2000, innerHeight: 800, scrollY: 700 });
    const { result } = renderHook(() => useScrollThreshold(0.5));
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);
  });

  it("does nothing when the document is not scrollable", () => {
    setScrollMetrics({ scrollHeight: 500, innerHeight: 800, scrollY: 0 });
    const { result } = renderHook(() => useScrollThreshold(0.5));
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(false);
  });

  it("stops listening for scroll events once the threshold has been reached", () => {
    setScrollMetrics({ scrollHeight: 2000, innerHeight: 800, scrollY: 700 });
    const { result, rerender } = renderHook(
      ({ threshold }) => useScrollThreshold(threshold),
      { initialProps: { threshold: 0.5 } },
    );
    expect(result.current).toBe(true);

    rerender({ threshold: 0.99 });
    expect(result.current).toBe(true);
  });
});
