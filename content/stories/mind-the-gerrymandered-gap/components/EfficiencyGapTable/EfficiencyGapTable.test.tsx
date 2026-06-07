import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EfficiencyGapTable from ".";

describe("EfficiencyGapTable", () => {
  it("renders without crashing with null districtCounts", () => {
    render(<EfficiencyGapTable districtCounts={null} />);
  });

  it("renders the table when districtCounts is provided", () => {
    // 6 districts of 9 voters each: 5 blue, 4 red
    const districtCounts: [number, number][] = Array.from({ length: 6 }, () => [
      5, 4,
    ]);
    render(<EfficiencyGapTable districtCounts={districtCounts} />);
    expect(
      screen.getByText(/sample efficiency gap calculation/i),
    ).toBeInTheDocument();
  });

  it("shows one row per district in the table", () => {
    const districtCounts: [number, number][] = [
      [5, 4],
      [3, 6],
      [5, 4],
      [5, 4],
      [5, 4],
      [5, 4],
    ];
    const { container } = render(
      <EfficiencyGapTable districtCounts={districtCounts} />,
    );
    const tbody = container.querySelector("tbody");
    // 6 district rows + 1 total row + 1 efficiency gap row = 8 rows
    expect(tbody?.querySelectorAll("tr")).toHaveLength(8);
  });

  it("shows Total and Efficiency Gap rows", () => {
    const districtCounts: [number, number][] = Array.from({ length: 6 }, () => [
      5, 4,
    ]);
    render(<EfficiencyGapTable districtCounts={districtCounts} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Efficiency Gap")).toBeInTheDocument();
  });

  it("shows 'in favor of' copy when there is a gap", () => {
    // All blue wins → red wastes many, gap favors blue (eg < 0)
    const districtCounts: [number, number][] = Array.from({ length: 6 }, () => [
      5, 4,
    ]);
    render(<EfficiencyGapTable districtCounts={districtCounts} />);
    expect(screen.getByText(/in favor of/i)).toBeInTheDocument();
  });

  it("shows no 'in favor of' copy when wasted votes are equal", () => {
    // Equal wasted votes: each district 5v5 split is impossible in integer math with odd total
    // Use a tie: 3 blue wins, 3 red wins with symmetric margins
    const districtCounts: [number, number][] = [
      [5, 4], // blue wins, red wastes 4, blue wastes 0
      [5, 4],
      [5, 4],
      [4, 5], // red wins, blue wastes 4, red wastes 0
      [4, 5],
      [4, 5],
    ];
    render(<EfficiencyGapTable districtCounts={districtCounts} />);
    const text = screen.queryByText(/in favor of/i);
    expect(text).toBeNull();
  });

  it("does not render placeholder text when districtCounts is provided", () => {
    const districtCounts: [number, number][] = Array.from({ length: 6 }, () => [
      5, 4,
    ]);
    render(<EfficiencyGapTable districtCounts={districtCounts} />);
    expect(screen.queryByText(/please finish drawing/i)).toBeNull();
  });
});
