import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GerrymanderPlayground from ".";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

beforeEach(() => {
  localStorage.clear();
});

describe("GerrymanderPlayground", () => {
  it("renders without crashing", () => {
    render(<GerrymanderPlayground />);
  });

  it("renders the district status panel from SampleGerrymander", () => {
    render(<GerrymanderPlayground />);
    expect(screen.getByText(/D1:/)).toBeInTheDocument();
  });

  it("renders the EfficiencyGapTable placeholder initially", () => {
    render(<GerrymanderPlayground />);
    expect(
      screen.getByText(/please finish drawing your districts/i),
    ).toBeInTheDocument();
  });

  it("shows Save and Reset buttons", () => {
    render(<GerrymanderPlayground />);
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });
});
