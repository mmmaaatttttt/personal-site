import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { writeMemoryItem } from "@/hooks/useMemoryStore";
import { standees } from "../../data";
import {
  DEFAULT_GUARANTEED_MULTIPLIER,
  DEFAULT_NUM_CHARACTERS,
  DEFAULT_RANDOM_COST,
  GUARANTEED_MULTIPLIER_KEY,
  NUM_CHARACTERS_KEY,
  RANDOM_COST_KEY,
  SWITCH_POINT_KEY,
} from "../../sliderStore";
import { standeesForCharacterCount } from "../../utils";
import MixedStrategyExplorer from ".";
import { TICK_INTERVAL_MS } from "./constants";

const defaultNumStandees = standeesForCharacterCount(
  standees,
  DEFAULT_NUM_CHARACTERS,
).length;

beforeEach(() => {
  vi.useFakeTimers();
  writeMemoryItem(RANDOM_COST_KEY, DEFAULT_RANDOM_COST);
  writeMemoryItem(GUARANTEED_MULTIPLIER_KEY, DEFAULT_GUARANTEED_MULTIPLIER);
  writeMemoryItem(NUM_CHARACTERS_KEY, DEFAULT_NUM_CHARACTERS);
  writeMemoryItem(SWITCH_POINT_KEY, Math.round(defaultNumStandees / 2));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("MixedStrategyExplorer", () => {
  it("renders the character/cost/switch-point sliders, a Play button, and the draws/cost so far", () => {
    render(<MixedStrategyExplorer />);
    expect(screen.getByText(/Number of Characters: 1/)).toBeInTheDocument();
    expect(screen.getByText(/Random Cost per Standee/)).toBeInTheDocument();
    expect(screen.getByText(/Guaranteed Cost Per Standee/)).toBeInTheDocument();
    expect(screen.getByText(/Switch Point/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    expect(
      screen.getByText(/Draws: 0 — Total Cost: 0 coins/),
    ).toBeInTheDocument();
  });

  it("swaps settings for a speed slider once playing", () => {
    render(<MixedStrategyExplorer />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    expect(screen.queryByText(/Number of Characters/)).not.toBeInTheDocument();
    expect(screen.getByText(/Speed: 1.0x/)).toBeInTheDocument();
  });

  it("accumulates coins and turns so far while playing", () => {
    render(<MixedStrategyExplorer />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    expect(
      screen.queryByText(/Draws: 0 — Total Cost: 0 coins/),
    ).not.toBeInTheDocument();
  });

  it("resets coins and turns so far when Reset is clicked", () => {
    render(<MixedStrategyExplorer />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(
      screen.getByText(/Draws: 0 — Total Cost: 0 coins/),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("recomputes the standee grid when the number of characters changes", () => {
    render(<MixedStrategyExplorer />);
    const slider = screen.getAllByRole("slider")[0];
    fireEvent.change(slider, { target: { value: "2" } });
    expect(screen.getByText(/Number of Characters: 2/)).toBeInTheDocument();
  });

  it("uses singular 'coin' when the random cost slider is set to 1", () => {
    render(<MixedStrategyExplorer />);
    const slider = screen.getAllByRole("slider")[1];
    fireEvent.change(slider, { target: { value: "1" } });
    expect(
      screen.getByText(/Random Cost per Standee: 1 coin$/),
    ).toBeInTheDocument();
  });

  it("lets the player choose the switch point directly", () => {
    render(<MixedStrategyExplorer />);
    const slider = screen.getAllByRole("slider")[3];
    fireEvent.change(slider, { target: { value: "0" } });
    expect(screen.getByText(/Switch Point: 0/)).toBeInTheDocument();
  });
});
