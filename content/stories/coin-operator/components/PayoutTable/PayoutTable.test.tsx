import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { PayoutGroup } from "../../table-data";
import PayoutTable from ".";

const mockData: PayoutGroup[] = [
  { classification: "🥅🥅", payout: 30, probability: 0.03 },
  { classification: "🟡🟡🟡", payout: 3, probability: 0.1 },
  { classification: "👑👑👑👑", payout: 100, probability: 0.0001 },
];

describe("PayoutTable", () => {
  it("renders without crashing", () => {
    render(<PayoutTable data={mockData} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<PayoutTable data={mockData} />);
    expect(screen.getByText("Winning Combination")).toBeInTheDocument();
    expect(screen.getByText("Payout")).toBeInTheDocument();
    expect(screen.getByText("Probability")).toBeInTheDocument();
  });

  it("does not render a sort button for the Winning Combination column", () => {
    render(<PayoutTable data={mockData} />);
    expect(
      screen.queryByRole("button", { name: "Sort by Winning Combination" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /sort by/i })).toHaveLength(2);
  });

  it("defaults to sorting by payout ascending", () => {
    render(<PayoutTable data={mockData} />);
    const rows = screen.getAllByRole("row");
    // 1 header row + 3 data rows; lowest payout (3) first
    expect(rows).toHaveLength(4);
    expect(rows[1]).toHaveTextContent("🟡🟡🟡");
  });

  it("sorts by probability when the Probability header is clicked", () => {
    render(<PayoutTable data={mockData} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Sort by Probability" }),
    );
    const rows = screen.getAllByRole("row");
    // Lowest probability (0.0001) first
    expect(rows[1]).toHaveTextContent("👑👑👑👑");
  });

  it("toggles sort direction when the same header is clicked twice", () => {
    render(<PayoutTable data={mockData} />);
    const payoutButton = screen.getByRole("button", { name: "Sort by Payout" });
    // Payout is already the active sort key (ascending) — first click reverses it
    fireEvent.click(payoutButton);
    let rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("👑👑👑👑");
    fireEvent.click(payoutButton);
    rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("🟡🟡🟡");
  });

  it("accepts an empty data array without crashing", () => {
    render(<PayoutTable data={[]} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
