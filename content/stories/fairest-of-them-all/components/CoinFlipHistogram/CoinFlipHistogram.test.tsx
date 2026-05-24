import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CoinFlipHistogram from ".";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, animate: vi.fn() };
});

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("CoinFlipHistogram", () => {
  it("renders without crashing", () => {
    const { container } = render(<CoinFlipHistogram />);
    expect(container).toBeTruthy();
  });

  it("renders with a caption", () => {
    render(<CoinFlipHistogram caption="Test caption" />);
    expect(screen.getByText("Test caption")).toBeTruthy();
  });

  it("renders the slider labels", () => {
    render(<CoinFlipHistogram />);
    expect(screen.getByText(/Number of coin flips/)).toBeTruthy();
    expect(screen.getByText(/Probability of flipping heads/)).toBeTruthy();
  });

  it("renders an SVG for the histogram", () => {
    const { container } = render(<CoinFlipHistogram />);
    expect(container.querySelector("svg")).toBeTruthy();
  });
});
