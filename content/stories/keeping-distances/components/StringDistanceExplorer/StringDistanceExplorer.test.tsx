import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StringDistanceExplorer from ".";

describe("StringDistanceExplorer", () => {
  it("renders without crashing", () => {
    render(<StringDistanceExplorer />);
    expect(screen.getByLabelText("First Word")).toBeTruthy();
    expect(screen.getByLabelText("Second Word")).toBeTruthy();
  });

  it("renders the distance table with expected headers", () => {
    render(<StringDistanceExplorer />);
    expect(screen.getByText("Metric")).toBeTruthy();
    expect(screen.getByText("Distance")).toBeTruthy();
  });

  it("shows all three metric rows", () => {
    render(<StringDistanceExplorer />);
    expect(screen.getByText("Hamming distance")).toBeTruthy();
    expect(screen.getByText("Levenshtein distance")).toBeTruthy();
    expect(screen.getByText("Damerau-Levenshtein distance")).toBeTruthy();
  });

  it("starts with default words and shows damerau distance of 1", () => {
    render(<StringDistanceExplorer />);
    // 'matehmatics' vs 'mathematics' → D-L distance = 1
    const cells = screen.getAllByRole("cell");
    const damerauRow = cells.find((c) =>
      c.textContent?.includes("Damerau-Levenshtein"),
    );
    expect(damerauRow).toBeTruthy();
    // the next sibling cell should contain "1"
    const rows = screen.getAllByRole("row");
    const damerauDataRow = rows.find((r) =>
      r.textContent?.includes("Damerau-Levenshtein"),
    );
    expect(damerauDataRow?.textContent).toContain("1");
  });

  it("shows same-length strings message for Hamming when lengths differ", () => {
    render(<StringDistanceExplorer />);
    // default: 'matehmatics' (11) vs 'mathematics' (11) — same length, should be a number
    // change first word to a shorter one
    const input = screen.getByLabelText("First Word");
    fireEvent.change(input, { target: { value: "cat" } });
    expect(screen.getByText("Strings must have the same length")).toBeTruthy();
  });

  it("shows Hamming distance as a number when strings have equal length", () => {
    render(<StringDistanceExplorer />);
    const input1 = screen.getByLabelText("First Word");
    const input2 = screen.getByLabelText("Second Word");
    fireEvent.change(input1, { target: { value: "ghost" } });
    fireEvent.change(input2, { target: { value: "roast" } });
    // hamming("ghost", "roast") = 3
    const rows = screen.getAllByRole("row");
    const hammingRow = rows.find((r) => r.textContent?.includes("Hamming"));
    expect(hammingRow?.textContent).toContain("3");
  });

  it("updates distances when inputs change", () => {
    render(<StringDistanceExplorer />);
    const input1 = screen.getByLabelText("First Word");
    const input2 = screen.getByLabelText("Second Word");
    fireEvent.change(input1, { target: { value: "abc" } });
    fireEvent.change(input2, { target: { value: "abc" } });
    // all distances should be 0
    const rows = screen.getAllByRole("row");
    for (const row of rows.slice(1)) {
      expect(row.textContent).toContain("0");
    }
  });

  it("renders a caption when provided", () => {
    render(<StringDistanceExplorer caption="String distances demo" />);
    expect(screen.getByText("String distances demo")).toBeTruthy();
  });
});
