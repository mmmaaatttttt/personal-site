import { fireEvent, render, screen } from "@testing-library/react";
import { animate } from "framer-motion";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SlotMachine from ".";
import { HISTORY_STORAGE_KEY } from "./constants";

// animate() is imperative and doesn't run in jsdom — mock it as a no-op by
// default; individual tests override the implementation to synchronously
// resolve a spin.
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, animate: vi.fn() };
});

type AnimateOptions = Parameters<typeof animate>[2] & {
  onUpdate?: (v: number) => void;
  onComplete?: () => void;
};

const resolveImmediately = () => {
  vi.mocked(animate).mockImplementation((_from, _to, options) => {
    const opts = options as AnimateOptions;
    opts.onUpdate?.(0.5);
    opts.onComplete?.();
    return { stop: vi.fn() } as unknown as ReturnType<typeof animate>;
  });
};

const getResetButton = () =>
  screen.getByRole("button", { name: "Clear History" });
const getSpinButton = () => screen.getByRole("button", { name: "Pull!" });
const getViewToggle = () => screen.getByRole("switch");

beforeEach(() => {
  localStorage.clear();
});

describe("SlotMachine", () => {
  it("renders four empty reels and an enabled spin button initially", () => {
    render(<SlotMachine />);
    expect(screen.getAllByText("❔")).toHaveLength(4);
    expect(getSpinButton()).not.toBeDisabled();
  });

  it("disables the spin button while a spin animation is in flight", () => {
    render(<SlotMachine />);
    fireEvent.click(getSpinButton());
    expect(getSpinButton()).toBeDisabled();
  });

  it("keeps the payout hidden until every reel has locked in", () => {
    let calls = 0;
    vi.mocked(animate).mockImplementation((_from, _to, options) => {
      const opts = options as AnimateOptions;
      calls += 1;
      opts.onUpdate?.(0.5);
      if (calls <= 3) opts.onComplete?.();
      return { stop: vi.fn() } as unknown as ReturnType<typeof animate>;
    });
    render(<SlotMachine />);
    fireEvent.click(getSpinButton());
    expect(getSpinButton()).toBeDisabled();
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  it("resolves a spin once all reels lock: re-enables the button and shows a payout", () => {
    resolveImmediately();
    render(<SlotMachine />);
    fireEvent.click(getSpinButton());
    expect(getSpinButton()).not.toBeDisabled();
    expect(screen.queryByText("❔")).not.toBeInTheDocument();
    expect(screen.queryByText("–")).not.toBeInTheDocument();
  });

  it("persists cumulative history to localStorage after a spin", () => {
    resolveImmediately();
    render(<SlotMachine />);
    fireEvent.click(getSpinButton());
    const stored = JSON.parse(
      localStorage.getItem(HISTORY_STORAGE_KEY) ?? "[]",
    );
    expect(stored).toHaveLength(1);
  });

  it("accumulates cumulative totals in history across multiple spins", () => {
    resolveImmediately();
    render(<SlotMachine />);
    fireEvent.click(getSpinButton());
    fireEvent.click(getSpinButton());
    const stored = JSON.parse(
      localStorage.getItem(HISTORY_STORAGE_KEY) ?? "[]",
    );
    expect(stored).toHaveLength(2);
  });

  it("shows a trend chart with axes even before any spins", () => {
    render(<SlotMachine />);
    fireEvent.click(getViewToggle());
    expect(screen.queryByRole("img")).toBeInTheDocument();
  });

  it("resets stored history when the reset button is clicked", () => {
    resolveImmediately();
    render(<SlotMachine />);
    fireEvent.click(getSpinButton());
    expect(localStorage.getItem(HISTORY_STORAGE_KEY)).not.toBeNull();

    fireEvent.click(getResetButton());
    expect(localStorage.getItem(HISTORY_STORAGE_KEY)).toBeNull();
  });

  it("keeps the reset button available regardless of which view is active", () => {
    render(<SlotMachine />);
    expect(getResetButton()).toBeInTheDocument();
    fireEvent.click(getViewToggle());
    expect(getResetButton()).toBeInTheDocument();
  });
});
