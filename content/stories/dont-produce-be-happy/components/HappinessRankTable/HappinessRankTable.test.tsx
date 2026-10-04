import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import type { UsHappinessYear } from "../../data";
import HappinessRankTable from ".";

const rows = [
  { year: 2014, rank: 15, score: 7.119 },
  { year: 2015, rank: 13, score: 7.104 },
  { year: 2016, rank: 14, score: 6.993 },
] as unknown as UsHappinessYear[];

describe("HappinessRankTable", () => {
  it("renders one row per year", () => {
    render(<HappinessRankTable rows={rows} />);
    expect(screen.getByText("2014")).toBeInTheDocument();
    expect(screen.getByText("2015")).toBeInTheDocument();
    expect(screen.getByText("2016")).toBeInTheDocument();
  });

  it("shows the score formatted to two decimal places", () => {
    render(<HappinessRankTable rows={rows} />);
    expect(screen.getByText("7.12")).toBeInTheDocument();
  });

  it("shows no delta indicator for the first year", () => {
    render(<HappinessRankTable rows={rows} />);
    const firstRow = screen.getByText("2014").closest("tr");
    expect(firstRow).not.toHaveTextContent("▲");
    expect(firstRow).not.toHaveTextContent("▼");
  });

  it("shows an up arrow when rank improves", () => {
    render(<HappinessRankTable rows={rows} />);
    const row2015 = screen.getByText("2015").closest("tr");
    expect(row2015).toHaveTextContent("▲");
    expect(row2015).toHaveTextContent("2");
  });

  it("shows a down arrow when rank worsens", () => {
    render(<HappinessRankTable rows={rows} />);
    const row2016 = screen.getByText("2016").closest("tr");
    expect(row2016).toHaveTextContent("▼");
    expect(row2016).toHaveTextContent("1");
  });

  it("shows a neutral dash when rank is unchanged", () => {
    const unchanged = [
      { year: 2014, rank: 15, score: 7.1 },
      { year: 2015, rank: 15, score: 7.0 },
    ] as unknown as UsHappinessYear[];
    render(<HappinessRankTable rows={unchanged} />);
    const row2015 = screen.getByText("2015").closest("tr");
    expect(row2015).toHaveTextContent("—");
  });
});
