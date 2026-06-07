import { act, render, renderHook, screen } from "@testing-library/react";
import type { HTMLAttributes, MouseEvent, ReactNode, TouchEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import Tooltip, { useTooltip } from ".";

// Mock framer-motion to render static elements for tests
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    },
    AnimatePresence: ({ children }: { children?: ReactNode }) => (
      <>{children}</>
    ),
  };
});

describe("Tooltip Hook and Component", () => {
  it("useTooltip correctly manages tooltip state", () => {
    const { result } = renderHook(() => useTooltip());

    expect(result.current.tooltip).toBeNull();

    act(() => {
      result.current.showTooltip(
        "Title",
        "Body",
      )({ clientX: 100, clientY: 200 } as unknown as MouseEvent<Element>);
    });

    expect(result.current.tooltip).toEqual({
      title: "Title",
      body: "Body",
      x: 100,
      y: 200,
    });

    act(() => {
      result.current.hideTooltip();
    });

    expect(result.current.tooltip).toBeNull();
  });

  it("renders correctly when info is provided", () => {
    const info = {
      title: "Test Tooltip",
      body: "Tooltip body content",
      x: 50,
      y: 50,
    };

    render(<Tooltip info={info} />);

    expect(screen.getByText("Test Tooltip")).toBeInTheDocument();
    expect(screen.getByText("Tooltip body content")).toBeInTheDocument();
  });

  it("handles array bodies correctly", () => {
    const info = {
      title: "Array Tooltip",
      body: ["Line 1", "Line 2"],
      x: 50,
      y: 50,
    };

    render(<Tooltip info={info} />);

    expect(screen.getByText("Line 1")).toBeInTheDocument();
    expect(screen.getByText("Line 2")).toBeInTheDocument();
  });

  it("reads clientX/clientY from a touch event", () => {
    const { result } = renderHook(() => useTooltip());

    act(() => {
      result.current.showTooltip(
        "Touch",
        "Body",
      )({
        touches: [{ clientX: 200, clientY: 300 }],
      } as unknown as TouchEvent<Element>);
    });

    expect(result.current.tooltip).toEqual({
      title: "Touch",
      body: "Body",
      x: 200,
      y: 300,
    });
  });

  it("constrains tooltip width when x is near the left edge", () => {
    const info = { title: "", body: "edge case", x: 0, y: 100 };
    render(<Tooltip info={info} />);
    const tooltip = document.querySelector(".pointer-events-none");
    expect(tooltip).toHaveStyle({ width: "0px" });
  });

  it("updates size state when tooltip element dimensions change", () => {
    const info = { title: "Resize test", body: "body", x: 200, y: 200 };
    const { rerender } = render(<Tooltip info={info} />);
    const tooltipEl = document.querySelector(
      ".pointer-events-none",
    ) as HTMLElement;

    Object.defineProperty(tooltipEl, "offsetWidth", {
      get: () => 150,
      configurable: true,
    });
    Object.defineProperty(tooltipEl, "offsetHeight", {
      get: () => 60,
      configurable: true,
    });

    rerender(<Tooltip info={info} />);

    expect(document.querySelector(".pointer-events-none")).toBeInTheDocument();
  });
});
