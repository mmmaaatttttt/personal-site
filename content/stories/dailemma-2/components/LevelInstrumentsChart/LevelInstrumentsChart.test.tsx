import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import LevelInstrumentsChart from ".";

beforeEach(() => {
  localStorage.clear();
});

describe("LevelInstrumentsChart", () => {
  it("renders without crashing", () => {
    render(<LevelInstrumentsChart />);
  });

  it("renders 6 slider inputs (4 base + UBI + capital tax, all always visible)", () => {
    const { container } = render(<LevelInstrumentsChart />);
    expect(container.querySelectorAll('input[type="range"]')).toHaveLength(6);
  });

  it("shows Coordinated and Market vertical marker labels", () => {
    render(<LevelInstrumentsChart />);
    expect(screen.getByText("Coordinated")).toBeInTheDocument();
    expect(screen.getByText("Market")).toBeInTheDocument();
  });

  it("shows legend labels and axis labels for all three curves", () => {
    render(<LevelInstrumentsChart />);
    expect(screen.getByText("Baseline")).toBeInTheDocument();
    expect(screen.getByText("UBI")).toBeInTheDocument();
    expect(screen.getByText("Capital Tax")).toBeInTheDocument();
    expect(screen.getByText("Share of jobs automated")).toBeInTheDocument();
  });
});
