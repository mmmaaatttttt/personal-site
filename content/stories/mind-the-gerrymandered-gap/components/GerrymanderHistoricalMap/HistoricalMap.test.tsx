import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ElectionRow, StateSummary } from "../../data";
import HistoricalMap from "./HistoricalMap";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

const mockElectionData: ElectionRow[] = [
  { year: 2016, state: "Pennsylvania", district: 1, dem: 1000, rep: 800, demEst: false, repEst: false },
  { year: 2016, state: "Pennsylvania", district: 2, dem: 900, rep: 1100, demEst: false, repEst: false },
  { year: 2014, state: "Pennsylvania", district: 1, dem: 800, rep: 900, demEst: false, repEst: false },
  { year: 2014, state: "Pennsylvania", district: 2, dem: 750, rep: 850, demEst: false, repEst: false },
];

const mockStateSummaries: StateSummary[] = [
  {
    state: "Pennsylvania",
    efficiencyGaps: { 2016: 0.1, 2014: 0.05 },
    seatGaps: { 2016: 2.0, 2014: 0.5 },
  },
];

describe("HistoricalMap", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders without crashing", async () => {
    await act(async () => {
      render(
        <HistoricalMap
          electionData={mockElectionData}
          stateSummaries={mockStateSummaries}
        />
      );
    });
    expect(document.body).toBeTruthy();
  });

  it("renders year slider with initial value of 2016", async () => {
    await act(async () => {
      render(
        <HistoricalMap
          electionData={mockElectionData}
          stateSummaries={mockStateSummaries}
        />
      );
    });
    expect(screen.getByText(/Year: 2016/i)).toBeInTheDocument();
  });

  it("renders minimum electors slider label", async () => {
    await act(async () => {
      render(
        <HistoricalMap
          electionData={mockElectionData}
          stateSummaries={mockStateSummaries}
        />
      );
    });
    expect(screen.getByText(/Minimum Number of Electors/i)).toBeInTheDocument();
  });

  it("renders with empty data without crashing", async () => {
    await act(async () => {
      render(<HistoricalMap electionData={[]} stateSummaries={[]} />);
    });
    expect(document.body).toBeTruthy();
  });

  it("updates year label when slider changes", async () => {
    await act(async () => {
      render(
        <HistoricalMap
          electionData={mockElectionData}
          stateSummaries={mockStateSummaries}
        />
      );
    });

    const sliders = screen.getAllByRole("slider");
    const yearSlider = sliders[0];
    await act(async () => {
      fireEvent.change(yearSlider, { target: { value: "2014" } });
    });
    expect(screen.getByText(/Year: 2014/i)).toBeInTheDocument();
  });
});
