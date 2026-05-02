import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { GERRYMANDER_COUNTS_EVENT, GERRYMANDER_COUNTS_KEY } from "../SampleGerrymander/constants";
import StandaloneEfficiencyGapTable from ".";

describe("StandaloneEfficiencyGapTable", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders without crashing", () => {
    render(<StandaloneEfficiencyGapTable />);
    expect(document.body).toBeTruthy();
  });

  it("shows prompt when no district counts are available", () => {
    render(<StandaloneEfficiencyGapTable />);
    expect(
      screen.getByText(/finish drawing your districts/i)
    ).toBeInTheDocument();
  });

  it("shows saved counts from localStorage on mount", () => {
    const counts: [number, number][] = [
      [5, 4],
      [3, 6],
      [4, 5],
      [5, 4],
      [4, 5],
      [5, 4],
    ];
    localStorage.setItem(GERRYMANDER_COUNTS_KEY, JSON.stringify(counts));
    render(<StandaloneEfficiencyGapTable />);
    expect(
      screen.getByText(/sample efficiency gap calculation/i)
    ).toBeInTheDocument();
  });

  it("updates when the gerrymander counts event fires", async () => {
    render(<StandaloneEfficiencyGapTable />);
    expect(screen.getByText(/finish drawing/i)).toBeInTheDocument();

    const counts: [number, number][] = [
      [5, 4],
      [3, 6],
      [4, 5],
      [5, 4],
      [4, 5],
      [5, 4],
    ];
    await act(async () => {
      window.dispatchEvent(
        new CustomEvent(GERRYMANDER_COUNTS_EVENT, { detail: counts })
      );
    });

    expect(
      screen.getByText(/sample efficiency gap calculation/i)
    ).toBeInTheDocument();
  });

  it("reverts to prompt when null counts event fires", async () => {
    const counts: [number, number][] = [
      [5, 4],
      [3, 6],
      [4, 5],
      [5, 4],
      [4, 5],
      [5, 4],
    ];
    localStorage.setItem(GERRYMANDER_COUNTS_KEY, JSON.stringify(counts));
    render(<StandaloneEfficiencyGapTable />);

    await act(async () => {
      window.dispatchEvent(
        new CustomEvent(GERRYMANDER_COUNTS_EVENT, { detail: null })
      );
    });

    expect(screen.getByText(/finish drawing/i)).toBeInTheDocument();
  });
});
