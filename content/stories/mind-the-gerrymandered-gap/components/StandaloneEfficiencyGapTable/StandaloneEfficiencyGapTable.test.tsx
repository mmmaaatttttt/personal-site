import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  GERRYMANDER_COUNTS_EVENT,
  GERRYMANDER_COUNTS_KEY,
} from "../SampleGerrymander/constants";
import StandaloneEfficiencyGapTable from ".";

describe("StandaloneEfficiencyGapTable", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders without crashing", () => {
    render(<StandaloneEfficiencyGapTable />);
    expect(document.body).toBeTruthy();
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
      screen.getByText(/sample efficiency gap calculation/i),
    ).toBeInTheDocument();
  });

  it("falls back to null when the saved value isn't valid JSON", () => {
    localStorage.setItem(GERRYMANDER_COUNTS_KEY, "not valid json");
    render(<StandaloneEfficiencyGapTable />);
    expect(
      screen.queryByText(/sample efficiency gap calculation/i),
    ).not.toBeInTheDocument();
  });

  it("updates when the gerrymander counts event fires", async () => {
    render(<StandaloneEfficiencyGapTable />);

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
        new CustomEvent(GERRYMANDER_COUNTS_EVENT, { detail: counts }),
      );
    });

    expect(
      screen.getByText(/sample efficiency gap calculation/i),
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
        new CustomEvent(GERRYMANDER_COUNTS_EVENT, { detail: null }),
      );
    });

    expect(
      screen.queryByText(/sample efficiency gap calculation/i),
    ).not.toBeInTheDocument();
  });
});
