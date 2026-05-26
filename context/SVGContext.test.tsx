import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { SVGContext, useSVGContext } from "./SVGContext";

const mockValue = {
  width: 400,
  height: 300,
  padding: { top: 10, bottom: 10, left: 10, right: 10 },
  dimensions: {
    width: 380,
    height: 280,
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
};

describe("useSVGContext", () => {
  it("throws when used outside a SVGContext provider", () => {
    expect(() => renderHook(() => useSVGContext())).toThrow(
      "useSVGContext must be used within a ClippedSVG provider",
    );
  });

  it("returns the context value when inside a provider", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SVGContext.Provider value={mockValue}>{children}</SVGContext.Provider>
    );
    const { result } = renderHook(() => useSVGContext(), { wrapper });
    expect(result.current).toEqual(mockValue);
  });

  it("returns updated value when context changes", () => {
    const updatedValue = { ...mockValue, width: 800 };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SVGContext.Provider value={updatedValue}>{children}</SVGContext.Provider>
    );
    const { result } = renderHook(() => useSVGContext(), { wrapper });
    expect(result.current.width).toBe(800);
  });
});
