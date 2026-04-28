import { render } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import React from "react";

vi.mock("../../data", () => ({
  electionData: [],
  stateSummaries: [],
}));

vi.mock("./HistoricalMap", () => ({
  default: ({ electionData, stateSummaries }: { electionData: unknown[]; stateSummaries: unknown[] }) => (
    <div data-testid="historical-map"
      data-election-count={electionData.length}
      data-summary-count={stateSummaries.length}
    />
  ),
}));

describe("GerrymanderHistoricalMap", () => {
  it("renders HistoricalMap with data from the data module", async () => {
    const { default: GerrymanderHistoricalMap } = await import(".");
    const { getByTestId } = render(<GerrymanderHistoricalMap />);
    const el = getByTestId("historical-map");
    expect(el).toBeInTheDocument();
    expect(el.getAttribute("data-election-count")).toBe("0");
    expect(el.getAttribute("data-summary-count")).toBe("0");
  });
});
