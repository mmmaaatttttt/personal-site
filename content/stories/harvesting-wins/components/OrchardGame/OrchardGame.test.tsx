import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import OrchardGame from ".";
import { SPINNER_COLORS } from "./constants";

// animate() resolves synchronously so onComplete fires with a controllable spin result.
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    animate: vi.fn(
      (
        _from: number,
        to: number,
        opts: { onUpdate?: (v: number) => void; onComplete?: () => void },
      ) => {
        opts.onUpdate?.(to);
        opts.onComplete?.();
      },
    ),
  };
});

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Tracks accumulated rotation to solve the Math.random() values that land a given spin index.
let cumulativeRotation = 0;

function resetSpinTracking() {
  cumulativeRotation = 0;
}

function queueSpin(idx: number) {
  const targetMod = (idx + 0.5) / SPINNER_COLORS.length;
  const currentMod = (((cumulativeRotation / 360) % 1) + 1) % 1;
  let deltaMod = targetMod - currentMod;
  if (deltaMod <= 0) deltaMod += 1;
  const multiplier = 1 + deltaMod; // direction always +1, magnitude in (1,2]
  const r2 = (multiplier - 1) / 4;
  cumulativeRotation += 360 * multiplier;
  vi.spyOn(Math, "random")
    .mockReturnValueOnce(0.9) // direction: +1
    .mockReturnValueOnce(r2)
    .mockReturnValueOnce(0.5); // duration, irrelevant here
}

const FRUIT_IDX = [0, 1, 2, 3];
const RAVEN_IDX = 4;
const BASKET_IDX = 5;

function clickSpin() {
  fireEvent.click(screen.getByRole("button", { name: "Spin!" }));
}

describe("OrchardGame", () => {
  it("shows the start overlay with a Play button", () => {
    render(<OrchardGame />);
    expect(screen.getByText("Orchard Game")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("hides the overlay and shows the Spin button after clicking Play", () => {
    render(<OrchardGame />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(screen.queryByText("Orchard Game")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Spin!" })).toBeInTheDocument();
  });

  it("displays games played and games won on the overlay", () => {
    render(<OrchardGame />);
    expect(screen.getByText("Games won: 0")).toBeInTheDocument();
    expect(screen.getByText("Games played: 0")).toBeInTheDocument();
  });

  it("increments games played each time Play is clicked", () => {
    render(<OrchardGame />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    // Game is now playing — click the spinner area to get back (not possible without spinning)
    // Instead, directly verify localStorage was written
    expect(localStorage.getItem("harvestingWins:gamesPlayed")).toBe("1");
  });

  it("clears stored data when Clear Game Data is clicked", () => {
    localStorage.setItem("harvestingWins:gamesPlayed", "5");
    localStorage.setItem("harvestingWins:gamesWon", "3");
    render(<OrchardGame />);
    fireEvent.click(screen.getByRole("button", { name: "Clear Game Data" }));
    expect(screen.getByText("Games won: 0")).toBeInTheDocument();
    expect(screen.getByText("Games played: 0")).toBeInTheDocument();
    expect(localStorage.getItem("harvestingWins:gamesPlayed")).toBeNull();
    expect(localStorage.getItem("harvestingWins:gamesWon")).toBeNull();
  });

  it("restores persisted win/loss counts from localStorage on mount", () => {
    localStorage.setItem("harvestingWins:gamesPlayed", "10");
    localStorage.setItem("harvestingWins:gamesWon", "7");
    render(<OrchardGame />);
    expect(screen.getByText("Games won: 7")).toBeInTheDocument();
    expect(screen.getByText("Games played: 10")).toBeInTheDocument();
  });

  it("renders all five fruit/raven tiles", () => {
    render(<OrchardGame />);
    // Tiles are always mounted; the overlay just sits on top
    const fruitLabels = screen.getAllByText("Fruit");
    const ravenLabels = screen.getAllByText("Raven");
    expect(fruitLabels.length).toBe(4);
    expect(ravenLabels.length).toBe(1);
  });

  describe("gameplay", () => {
    beforeEach(() => {
      resetSpinTracking();
    });

    it("removes a fruit tile when a fruit is spun", () => {
      render(<OrchardGame />);
      fireEvent.click(screen.getByRole("button", { name: "Play" }));

      queueSpin(FRUIT_IDX[0]);
      clickSpin();

      const fruitTile = screen.getAllByText("Fruit")[0].closest("button");
      expect(fruitTile).toHaveTextContent("3");
    });

    it("decrements the raven and continues playing while the raven survives", () => {
      render(<OrchardGame />);
      fireEvent.click(screen.getByRole("button", { name: "Play" }));

      queueSpin(RAVEN_IDX);
      clickSpin();

      expect(screen.queryByText("You lost.")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Spin!" })).toBeInTheDocument();
    });

    it("enables the fruit basket wildcard, then clicking a tile removes a fruit and disables it again", () => {
      render(<OrchardGame />);
      fireEvent.click(screen.getByRole("button", { name: "Play" }));

      queueSpin(BASKET_IDX);
      clickSpin();
      expect(
        screen.getByText("Click on a square to remove a fruit."),
      ).toBeInTheDocument();

      const fruitTile = screen.getAllByText("Fruit")[0].closest("button");
      expect(fruitTile).not.toBeDisabled();
      fireEvent.click(fruitTile as Element);

      expect(fruitTile).toHaveTextContent("3");
      expect(
        screen.queryByText("Click on a square to remove a fruit."),
      ).not.toBeInTheDocument();
    });

    it("declares a loss once the raven count reaches zero", () => {
      render(<OrchardGame />);
      fireEvent.click(screen.getByRole("button", { name: "Play" }));

      // INITIAL_RAVEN_COUNT is 5.
      for (let i = 0; i < 5; i++) {
        queueSpin(RAVEN_IDX);
        clickSpin();
      }

      expect(screen.getByText("You lost.")).toBeInTheDocument();
    });

    it("declares a win once every fruit color is fully harvested", () => {
      render(<OrchardGame />);
      fireEvent.click(screen.getByRole("button", { name: "Play" }));

      // Each fruit color starts at 4; clear all four colors.
      for (const idx of FRUIT_IDX) {
        for (let i = 0; i < 4; i++) {
          queueSpin(idx);
          clickSpin();
        }
      }

      expect(screen.getByText("You won!")).toBeInTheDocument();
      expect(screen.getByText("Games won: 1")).toBeInTheDocument();
    });

    it("starts a new game from the win/loss overlay", () => {
      render(<OrchardGame />);
      fireEvent.click(screen.getByRole("button", { name: "Play" }));
      for (let i = 0; i < 5; i++) {
        queueSpin(RAVEN_IDX);
        clickSpin();
      }
      expect(screen.getByText("You lost.")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Play Again" }));
      expect(screen.queryByText("You lost.")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Spin!" })).toBeInTheDocument();
    });
  });
});
