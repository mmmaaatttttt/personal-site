import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { writeMemoryItem } from "@/hooks/useMemoryStore";
import { standees } from "../../data";
import { DEFAULT_NUM_CHARACTERS, NUM_CHARACTERS_KEY } from "../../sliderStore";
import { standeesForCharacterCount } from "../../utils";
import StandeeCollector from ".";
import { TICK_INTERVAL_MS } from "./constants";

const defaultStandeeCount = standeesForCharacterCount(
  standees,
  DEFAULT_NUM_CHARACTERS,
).length;
// Each character's starter standee is found from the start, with no draw.
const defaultFoundCount = DEFAULT_NUM_CHARACTERS;

beforeEach(() => {
  vi.useFakeTimers();
  writeMemoryItem(NUM_CHARACTERS_KEY, DEFAULT_NUM_CHARACTERS);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("StandeeCollector", () => {
  it("renders the slider, a Play button, and the draw/found counter", () => {
    render(<StandeeCollector />);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    expect(
      screen.getByText(
        `Draws: 0 — Found ${defaultFoundCount} / ${defaultStandeeCount}`,
      ),
    ).toBeInTheDocument();
  });

  it("swaps the settings slider for a speed slider once playing", () => {
    render(<StandeeCollector />);
    expect(screen.getByText(/Number of Characters/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    expect(screen.queryByText(/Number of Characters/)).not.toBeInTheDocument();
    expect(screen.getByText(/Speed: 1.0x/)).toBeInTheDocument();
  });

  it("updates the draw counter as the simulation ticks", () => {
    render(<StandeeCollector />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    expect(
      screen.queryByText(
        `Draws: 0 — Found ${defaultFoundCount} / ${defaultStandeeCount}`,
      ),
    ).not.toBeInTheDocument();
  });

  it("resets the draw counter when Reset is clicked", () => {
    render(<StandeeCollector />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => {
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 10);
    });
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(
      screen.getByText(
        `Draws: 0 — Found ${defaultFoundCount} / ${defaultStandeeCount}`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });
});
