import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { writeMemoryItem } from "@/hooks/useMemoryStore";
import {
  DEFAULT_GUARANTEED_MULTIPLIER,
  DEFAULT_RANDOM_COST,
  GUARANTEED_MULTIPLIER_KEY,
  NUM_STANDEES_KEY,
  RANDOM_COST_KEY,
  SWITCH_POINT_KEY,
} from "../../sliderStore";
import StrategyComparisonChart from ".";

beforeEach(() => {
  writeMemoryItem(RANDOM_COST_KEY, DEFAULT_RANDOM_COST);
  writeMemoryItem(GUARANTEED_MULTIPLIER_KEY, DEFAULT_GUARANTEED_MULTIPLIER);
  writeMemoryItem(NUM_STANDEES_KEY, 20);
  writeMemoryItem(SWITCH_POINT_KEY, 10);
});

describe("StrategyComparisonChart", () => {
  it("renders the sliders and a single-color chart with a movable marker", () => {
    render(<StrategyComparisonChart numStandees={20} />);
    expect(screen.getByText(/Number of Standees: 20/)).toBeInTheDocument();
    expect(screen.getByText(/Random Cost per Standee/)).toBeInTheDocument();
    expect(
      screen.getByText(/Guaranteed Cost Per Standee: 3x Random Cost/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Switch Point: 10/)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "strategy-comparison-chart" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Strategy Switch Point")).toBeInTheDocument();
    expect(screen.getByText("Expected Total Cost")).toBeInTheDocument();
    expect(document.querySelectorAll("path:not(.domain)")).toHaveLength(1);
    expect(document.querySelector("circle")).toBeInTheDocument();
  });

  it("has no play/pause controls -- it recomputes instantly", () => {
    render(<StrategyComparisonChart numStandees={20} />);
    expect(
      screen.queryByRole("button", { name: "Play" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Reset" }),
    ).not.toBeInTheDocument();
  });

  it("recomputes the curve when a cost slider changes", () => {
    render(<StrategyComparisonChart numStandees={20} />);
    const slider = screen.getAllByRole("slider")[1];
    fireEvent.change(slider, { target: { value: "25" } });
    expect(screen.getByText(/Random Cost per Standee: 25/)).toBeInTheDocument();
  });

  it("moves the marker to the chosen switch point", () => {
    render(<StrategyComparisonChart numStandees={20} />);
    const slider = screen.getAllByRole("slider")[3];
    fireEvent.change(slider, { target: { value: "5" } });
    expect(screen.getByText(/Switch Point: 5/)).toBeInTheDocument();
  });

  it("clamps the switch point when the number of standees shrinks below it", () => {
    render(<StrategyComparisonChart numStandees={20} />);
    const switchSlider = screen.getAllByRole("slider")[3];
    fireEvent.change(switchSlider, { target: { value: "18" } });

    const numStandeesSlider = screen.getAllByRole("slider")[0];
    fireEvent.change(numStandeesSlider, { target: { value: "10" } });

    expect(screen.getByText(/Switch Point: 10/)).toBeInTheDocument();
  });

  it("uses singular 'coin' when the random cost slider is set to 1", () => {
    render(<StrategyComparisonChart numStandees={20} />);
    const slider = screen.getAllByRole("slider")[1];
    fireEvent.change(slider, { target: { value: "1" } });
    expect(
      screen.getByText(/Random Cost per Standee: 1 coin$/),
    ).toBeInTheDocument();
  });

  it("falls back to the default total when numStandees is not passed", () => {
    render(<StrategyComparisonChart />);
    expect(
      screen.getByRole("img", { name: "strategy-comparison-chart" }),
    ).toBeInTheDocument();
  });
});
