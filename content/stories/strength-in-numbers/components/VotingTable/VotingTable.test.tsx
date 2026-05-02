import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { VoterStateRow } from "../../data";
import VotingTable from ".";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const mockData: VoterStateRow[] = [
  { state: "Alabama", averageSaturation: 0.85, averageTurnout: 0.55 },
  { state: "Alaska", averageSaturation: 0.72, averageTurnout: 0.62 },
  { state: "Arizona", averageSaturation: 0.68, averageTurnout: 0.47 },
  { state: "Arkansas", averageSaturation: 0.63, averageTurnout: 0.43 },
  { state: "California", averageSaturation: 0.79, averageTurnout: 0.57 },
  { state: "Colorado", averageSaturation: 0.91, averageTurnout: 0.70 },
];

describe("VotingTable", () => {
  it("renders without crashing", () => {
    render(<VotingTable tableData={mockData} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<VotingTable tableData={mockData} />);
    expect(screen.getByText("State")).toBeInTheDocument();
    expect(screen.getByText("Average Saturation")).toBeInTheDocument();
    expect(screen.getByText("Average Turnout")).toBeInTheDocument();
  });

  it("renders the slider", () => {
    render(<VotingTable tableData={mockData} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("shows 5 rows initially", () => {
    render(<VotingTable tableData={mockData} />);
    const rows = screen.getAllByRole("row");
    // 1 header row + 5 data rows
    expect(rows).toHaveLength(6);
  });

  it("defaults to sorting by average turnout ascending", () => {
    render(<VotingTable tableData={mockData} />);
    const rows = screen.getAllByRole("row");
    // First data row should be Arkansas (lowest turnout: 0.43)
    expect(rows[1]).toHaveTextContent("Arkansas");
  });

  it("sorts by state when State header is clicked", () => {
    render(<VotingTable tableData={mockData} />);
    const sortButtons = screen.getAllByRole("button", { name: /sort by/i });
    const stateButton = sortButtons.find((b) => b.getAttribute("aria-label") === "Sort by State");
    fireEvent.click(stateButton!);
    const rows = screen.getAllByRole("row");
    // Alabama should be first alphabetically
    expect(rows[1]).toHaveTextContent("Alabama");
  });

  it("toggles sort direction when the same header is clicked twice", () => {
    render(<VotingTable tableData={mockData} />);
    const sortButtons = screen.getAllByRole("button", { name: /sort by/i });
    const stateButton = sortButtons.find((b) => b.getAttribute("aria-label") === "Sort by State")!;
    // First click: ascending by state
    fireEvent.click(stateButton);
    let rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Alabama");
    // Second click: descending by state → Colorado first
    fireEvent.click(stateButton);
    rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Colorado");
  });

  it("accepts an empty tableData array without crashing", () => {
    render(<VotingTable tableData={[]} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
