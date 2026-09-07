import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectedCost, expectedTotalDraws } from "../../utils";
import PureStrategyComparison from ".";

describe("PureStrategyComparison", () => {
  it("renders the sliders and a comparison table for both pure strategies", () => {
    render(<PureStrategyComparison numStandees={20} />);
    expect(screen.getByText(/Number of Standees: 20/)).toBeInTheDocument();
    expect(screen.getByText(/Random Pack Cost/)).toBeInTheDocument();
    expect(screen.getByText(/Guaranteed Cost: 3x Random/)).toBeInTheDocument();

    const randomDraws = expectedTotalDraws(20, 20);
    const randomCost = expectedCost(20, 20, 10, 30);
    expect(screen.getByText(randomDraws.toFixed(1))).toBeInTheDocument();
    expect(
      screen.getByText(
        randomCost.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      ),
    ).toBeInTheDocument();

    // Guaranteed-only is exact: always numStandees purchases, no randomness.
    expect(screen.getByText("20")).toBeInTheDocument();
    const guaranteedCost = expectedCost(20, 0, 10, 30);
    expect(
      screen.getByText(
        guaranteedCost.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      ),
    ).toBeInTheDocument();
  });

  it("recomputes the table when the number of standees changes", () => {
    render(<PureStrategyComparison numStandees={20} />);
    const slider = screen.getAllByRole("slider")[0];
    fireEvent.change(slider, { target: { value: "30" } });
    expect(screen.getByText(/Number of Standees: 30/)).toBeInTheDocument();

    const randomCost = expectedCost(30, 30, 10, 30);
    expect(
      screen.getByText(
        randomCost.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      ),
    ).toBeInTheDocument();
  });

  it("recomputes the table when a cost slider changes", () => {
    render(<PureStrategyComparison numStandees={20} />);
    const slider = screen.getAllByRole("slider")[1];
    fireEvent.change(slider, { target: { value: "25" } });
    expect(screen.getByText(/Random Pack Cost: 25/)).toBeInTheDocument();

    const randomCost = expectedCost(20, 20, 25, 75);
    expect(
      screen.getByText(
        randomCost.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      ),
    ).toBeInTheDocument();
  });

  it("colors the cheaper strategy's row text green and the pricier one's red", () => {
    // At the defaults (10 random / 30 guaranteed per standee), guaranteed-only
    // is cheaper for a full 20-standee collection than pure-random redraws.
    render(<PureStrategyComparison numStandees={20} />);
    const guaranteedCost = expectedCost(20, 0, 10, 30);
    const randomCost = expectedCost(20, 20, 10, 30);
    const guaranteedRow = screen
      .getByText(
        guaranteedCost.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      )
      .closest("tr");
    const randomRow = screen
      .getByText(
        randomCost.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      )
      .closest("tr");
    expect(guaranteedRow).toHaveClass("text-green-700");
    expect(randomRow).toHaveClass("text-red-700");
  });

  it("flips the highlight when random-only becomes the cheaper strategy", () => {
    render(<PureStrategyComparison numStandees={20} />);
    // Push the guaranteed multiplier to its max, making guaranteed far
    // pricier than random for this collection size.
    const guaranteedMultiplierSlider = screen.getAllByRole("slider")[2];
    fireEvent.change(guaranteedMultiplierSlider, { target: { value: "10" } });

    const guaranteedCost = expectedCost(20, 0, 10, 100);
    const randomCost = expectedCost(20, 20, 10, 100);
    const guaranteedRow = screen
      .getByText(
        guaranteedCost.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      )
      .closest("tr");
    const randomRow = screen
      .getByText(
        randomCost.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      )
      .closest("tr");
    expect(randomRow).toHaveClass("text-green-700");
    expect(guaranteedRow).toHaveClass("text-red-700");
  });

  it("leaves both rows uncolored when the two strategies cost exactly the same", () => {
    // At numStandees=1 with a 1x guaranteed multiplier, both strategies cost
    // exactly randomCost: H_1 = 1, so random-only's n*H_n collapses to n, and
    // guaranteed-only's cost is n*guaranteedCost with guaranteedCost=randomCost.
    render(<PureStrategyComparison numStandees={1} />);
    const guaranteedMultiplierSlider = screen.getAllByRole("slider")[2];
    fireEvent.change(guaranteedMultiplierSlider, { target: { value: "1" } });

    const cost = expectedCost(1, 1, 10, 10);
    const rows = screen
      .getAllByText(
        cost.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      )
      .map((cell) => cell.closest("tr"));
    expect(rows).toHaveLength(2);
    for (const row of rows) {
      expect(row).not.toHaveClass("text-green-700");
      expect(row).not.toHaveClass("text-red-700");
    }
  });

  it("falls back to the default total when numStandees is not passed", () => {
    render(<PureStrategyComparison />);
    expect(screen.getAllByText("TBD").length).toBeGreaterThan(0);
  });
});
