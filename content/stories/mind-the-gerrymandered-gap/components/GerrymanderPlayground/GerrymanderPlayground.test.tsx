import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import GerrymanderPlayground from ".";

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

  it("does not render the EfficiencyGapTable initially (no district data)", () => {
    render(<GerrymanderPlayground />);
    expect(
      screen.queryByText(/sample efficiency gap calculation/i),
    ).not.toBeInTheDocument();
  });

  it("shows Save and Reset buttons", () => {
    render(<GerrymanderPlayground />);
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });
});
