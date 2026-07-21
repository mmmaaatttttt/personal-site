import { fireEvent, render, screen } from "@testing-library/react";
import { animate } from "framer-motion";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { evaluateActions } from "../../bonusMath";
import { SlotValue } from "../../data";
import SlotMachine from ".";
import { HISTORY_STORAGE_KEY } from "./constants";

// animate() is imperative and doesn't run in jsdom — mock it as a no-op by
// default; individual tests override the implementation to synchronously
// resolve a spin.
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, animate: vi.fn() };
});

// Deterministic spin results so bonus-spin math and EV badges are assertable.
vi.mock("../../math", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../math")>();
  return {
    ...actual,
    spinReels: vi.fn(() => [
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.DASH,
    ]),
    pickWeightedSymbol: vi.fn(() => SlotValue.CROWN),
  };
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
const getPullButton = () => screen.getByRole("button", { name: "Pull!" });
const getBonusSpinButton = () =>
  screen.getByRole("button", { name: /Bonus Spin/ });
const getViewToggle = () => screen.getAllByRole("switch")[0];
const getReelButtons = () =>
  screen
    .getAllByRole("button")
    .filter((btn) => btn.hasAttribute("aria-pressed"));

beforeEach(() => {
  localStorage.clear();
  // Individual tests override animate()'s implementation (e.g. via
  // resolveImmediately()); reset to the default no-op so that override
  // doesn't leak into later tests regardless of execution order.
  vi.mocked(animate).mockReset();
});

describe("SlotMachine (no bonus spins, the default)", () => {
  const noBonusHistoryKey = `${HISTORY_STORAGE_KEY}:0`;

  it("renders four empty reels and an enabled spin button initially", () => {
    render(<SlotMachine />);
    expect(screen.getAllByText("❔")).toHaveLength(4);
    expect(getPullButton()).not.toBeDisabled();
  });

  it("never shows the bonus spin button or EV toggle", () => {
    render(<SlotMachine />);
    expect(screen.queryByText(/Bonus Spin/)).not.toBeInTheDocument();
    expect(screen.getAllByRole("switch")).toHaveLength(1);
  });

  it("disables the spin button while a spin animation is in flight", () => {
    render(<SlotMachine />);
    fireEvent.click(getPullButton());
    expect(getPullButton()).toBeDisabled();
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
    fireEvent.click(getPullButton());
    expect(getPullButton()).toBeDisabled();
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  it("resolves a spin once all reels lock: re-enables the button and shows a payout", () => {
    resolveImmediately();
    render(<SlotMachine />);
    fireEvent.click(getPullButton());
    expect(getPullButton()).not.toBeDisabled();
    expect(screen.queryByText("❔")).not.toBeInTheDocument();
    expect(screen.queryByText("–")).not.toBeInTheDocument();
  });

  it("finalizes each pull straight into history (no pending round)", () => {
    resolveImmediately();
    render(<SlotMachine />);
    fireEvent.click(getPullButton());
    const stored = JSON.parse(localStorage.getItem(noBonusHistoryKey) ?? "[]");
    expect(stored).toHaveLength(1);
    // board is CROWN CROWN CROWN DASH (mocked) — no bonus spin available to
    // convert the dash, so this pays 0, not a jackpot.
    expect(stored[0]).toEqual([1, 0]);
  });

  it("accumulates cumulative totals in history across multiple spins", () => {
    resolveImmediately();
    render(<SlotMachine />);
    fireEvent.click(getPullButton());
    fireEvent.click(getPullButton());
    const stored = JSON.parse(localStorage.getItem(noBonusHistoryKey) ?? "[]");
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
    fireEvent.click(getPullButton());
    expect(localStorage.getItem(noBonusHistoryKey)).not.toBeNull();

    fireEvent.click(getResetButton());
    expect(localStorage.getItem(noBonusHistoryKey)).toBeNull();
  });

  it("keeps the reset button available regardless of which view is active", () => {
    render(<SlotMachine />);
    expect(getResetButton()).toBeInTheDocument();
    fireEvent.click(getViewToggle());
    expect(getResetButton()).toBeInTheDocument();
  });
});

describe("SlotMachine (maxBonusSpins > 0)", () => {
  const bonusHistoryKey = `${HISTORY_STORAGE_KEY}:3`;

  it("renders four empty reels and a disabled bonus spin button initially", () => {
    render(<SlotMachine maxBonusSpins={3} />);
    expect(screen.getAllByText("❔")).toHaveLength(4);
    expect(getPullButton()).not.toBeDisabled();
    expect(getBonusSpinButton()).toBeDisabled();
    expect(getBonusSpinButton()).toHaveTextContent("Bonus Spin (3)");
  });

  it("disables Pull! while the main spin animation is in flight", () => {
    render(<SlotMachine maxBonusSpins={3} />);
    fireEvent.click(getPullButton());
    expect(getPullButton()).toBeDisabled();
  });

  it("leaves the bonus spin button disabled until a reel is selected", () => {
    resolveImmediately();
    render(<SlotMachine maxBonusSpins={3} />);
    fireEvent.click(getPullButton());

    expect(getBonusSpinButton()).toBeDisabled();
    fireEvent.click(getReelButtons()[3]);
    expect(getBonusSpinButton()).not.toBeDisabled();
  });

  it("deselects a reel when it is clicked again", () => {
    resolveImmediately();
    render(<SlotMachine maxBonusSpins={3} />);
    fireEvent.click(getPullButton());

    const reel = getReelButtons()[3];
    fireEvent.click(reel);
    expect(reel).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(reel);
    expect(reel).toHaveAttribute("aria-pressed", "false");
    expect(getBonusSpinButton()).toBeDisabled();
  });

  it("spends a coin and re-rolls only the selected reel on a bonus spin", () => {
    resolveImmediately();
    render(<SlotMachine maxBonusSpins={3} />);
    fireEvent.click(getPullButton());

    // Board is CROWN CROWN CROWN DASH (mocked), so respinning the dash into
    // a mocked CROWN produces a four-crown jackpot payout of 100.
    fireEvent.click(getReelButtons()[3]);
    fireEvent.click(getBonusSpinButton());

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(getBonusSpinButton()).toHaveTextContent("Bonus Spin (2)");
  });

  it("finalizes the round into history once bonus spins are exhausted", () => {
    resolveImmediately();
    render(<SlotMachine maxBonusSpins={3} />);
    fireEvent.click(getPullButton());

    for (let i = 0; i < 3; i++) {
      fireEvent.click(getReelButtons()[3]);
      fireEvent.click(getBonusSpinButton());
    }

    expect(getBonusSpinButton()).toBeDisabled();
    expect(getBonusSpinButton()).toHaveTextContent("Bonus Spin (0)");

    const stored = JSON.parse(localStorage.getItem(bonusHistoryKey) ?? "[]");
    expect(stored).toHaveLength(1);
    // cost = 1 (pull) + 3 (bonus spins) = 4; final board is all crowns = 100
    expect(stored[0]).toEqual([4, 100]);
  });

  it("finalizes a pending round when Pull! is clicked again before it's exhausted", () => {
    resolveImmediately();
    render(<SlotMachine maxBonusSpins={3} />);
    fireEvent.click(getPullButton());

    fireEvent.click(getReelButtons()[3]);
    fireEvent.click(getBonusSpinButton());
    // one bonus spin used, round still pending (2 remaining) — pull again
    fireEvent.click(getPullButton());

    const stored = JSON.parse(localStorage.getItem(bonusHistoryKey) ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0]).toEqual([2, 100]);
  });

  it("shows a computed EV badge for each reel once the EV toggle is on", () => {
    resolveImmediately();
    render(<SlotMachine maxBonusSpins={3} />);
    fireEvent.click(getPullButton());

    const board = [
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.CROWN,
      SlotValue.DASH,
    ] as const;
    const expectedDashEV = evaluateActions(
      [...board] as [SlotValue, SlotValue, SlotValue, SlotValue],
      3,
    ).spin[SlotValue.DASH];

    expect(
      screen.queryByText(expectedDashEV?.toFixed(1) ?? ""),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Show expected value" }),
    );

    expect(
      screen.getByText(expectedDashEV?.toFixed(1) ?? ""),
    ).toBeInTheDocument();
  });

  it("only shows the EV toggle button after the first spin, and toggles its label", () => {
    render(<SlotMachine maxBonusSpins={3} />);
    expect(
      screen.queryByRole("button", { name: /expected value/ }),
    ).not.toBeInTheDocument();

    resolveImmediately();
    fireEvent.click(getPullButton());

    const evButton = screen.getByRole("button", {
      name: "Show expected value",
    });
    fireEvent.click(evButton);
    expect(
      screen.getByRole("button", { name: "Hide expected value" }),
    ).toBeInTheDocument();
  });

  it("keeps the EV toggle button visible across later spins once revealed", () => {
    resolveImmediately();
    render(<SlotMachine maxBonusSpins={3} />);

    // First spin reveals the button and lands a pending round.
    fireEvent.click(getPullButton());
    expect(
      screen.getByRole("button", { name: "Show expected value" }),
    ).toBeInTheDocument();

    // Exhaust the bonus spins so the round finalizes (roundPending -> false).
    for (let i = 0; i < 3; i++) {
      fireEvent.click(getReelButtons()[3]);
      fireEvent.click(getBonusSpinButton());
    }
    expect(
      screen.getByRole("button", { name: "Show expected value" }),
    ).toBeInTheDocument();

    // Pulling again briefly clears roundPending too — button should stay put.
    fireEvent.click(getPullButton());
    expect(
      screen.getByRole("button", { name: "Show expected value" }),
    ).toBeInTheDocument();
  });

  it("shows a trend chart and clears history from either view", () => {
    resolveImmediately();
    render(<SlotMachine maxBonusSpins={3} />);
    fireEvent.click(getPullButton());
    fireEvent.click(getReelButtons()[3]);
    fireEvent.click(getBonusSpinButton());

    fireEvent.click(getViewToggle());
    expect(screen.queryByRole("img")).toBeInTheDocument();

    fireEvent.click(getResetButton());
    expect(localStorage.getItem(bonusHistoryKey)).toBeNull();
  });
});
