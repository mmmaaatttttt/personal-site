import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CoinFlipBayesianModel from ".";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, animate: vi.fn() };
});

describe("CoinFlipBayesianModel", () => {
  it("renders without crashing", () => {
    const { container } = render(<CoinFlipBayesianModel />);
    expect(container).toBeTruthy();
  });

  it("renders heads and tails buttons starting at 0", () => {
    render(<CoinFlipBayesianModel />);
    expect(screen.getByText("Heads: 0")).toBeTruthy();
    expect(screen.getByText("Tails: 0")).toBeTruthy();
  });

  it("increments head count on click", () => {
    render(<CoinFlipBayesianModel />);
    fireEvent.click(screen.getByText("Heads: 0"));
    expect(screen.getByText("Heads: 1")).toBeTruthy();
  });

  it("increments tail count on click", () => {
    render(<CoinFlipBayesianModel />);
    fireEvent.click(screen.getByText("Tails: 0"));
    expect(screen.getByText("Tails: 1")).toBeTruthy();
  });

  it("resets counts on Reset click", () => {
    render(<CoinFlipBayesianModel />);
    fireEvent.click(screen.getByText("Heads: 0"));
    fireEvent.click(screen.getByText("Heads: 1"));
    fireEvent.click(screen.getByText("Reset Counts"));
    expect(screen.getByText("Heads: 0")).toBeTruthy();
    expect(screen.getByText("Tails: 0")).toBeTruthy();
  });

  it("renders the toggle switch", () => {
    render(<CoinFlipBayesianModel />);
    expect(screen.getByRole("switch")).toBeTruthy();
  });

  it("renders an SVG for the line chart", () => {
    const { container } = render(<CoinFlipBayesianModel />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("switches to the fair-coin-more-likely prior when the toggle is clicked", () => {
    render(<CoinFlipBayesianModel />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });
});
