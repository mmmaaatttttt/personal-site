import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ScrollProgressBar from ".";

describe("ScrollProgressBar", () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 1000,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      value: 500,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with 0% progress and correct aria attributes initially", () => {
    render(<ScrollProgressBar />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveStyle({ width: "0%" });
    expect(bar).toHaveAttribute("aria-valuenow", "0");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("updates progress on scroll", () => {
    render(<ScrollProgressBar />);
    document.documentElement.scrollTop = 250;
    fireEvent.scroll(window);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveStyle({ width: "50%" });
    expect(bar).toHaveAttribute("aria-valuenow", "50");
  });

  it("clamps to 0% when total scroll height is zero", () => {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 500,
      configurable: true,
    });
    render(<ScrollProgressBar />);
    fireEvent.scroll(window);
    expect(screen.getByRole("progressbar")).toHaveStyle({ width: "0%" });
  });

  it("removes the scroll listener on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<ScrollProgressBar />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
