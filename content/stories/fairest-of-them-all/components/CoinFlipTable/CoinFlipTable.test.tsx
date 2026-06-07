import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CoinFlipTable from ".";

describe("CoinFlipTable", () => {
  it("renders without crashing", () => {
    const { container } = render(<CoinFlipTable />);
    expect(container).toBeTruthy();
  });

  it("renders the table headers", () => {
    render(<CoinFlipTable />);
    expect(screen.getByText("Prob. of H")).toBeTruthy();
    expect(screen.getByText("Prob. of T")).toBeTruthy();
    expect(screen.getByText("Prob. of HT")).toBeTruthy();
    expect(screen.getByText("Prob. of TH")).toBeTruthy();
  });

  it("shows initial 50% probability values", () => {
    render(<CoinFlipTable />);
    expect(screen.getAllByText("50%").length).toBeGreaterThan(0);
    expect(screen.getAllByText("25.00%").length).toBeGreaterThanOrEqual(2);
  });

  it("renders the slider", () => {
    render(<CoinFlipTable />);
    expect(screen.getByText(/Probability of flipping heads/)).toBeTruthy();
  });
});
