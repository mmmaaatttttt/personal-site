import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CoinFlipTable from ".";

describe("CoinFlipTable", () => {
  it("renders without crashing", () => {
    const { container } = render(<CoinFlipTable />);
    expect(container).toBeTruthy();
  });

  it("renders with a caption", () => {
    render(<CoinFlipTable caption="Figure 3" />);
    expect(screen.getByText("Figure 3")).toBeTruthy();
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
