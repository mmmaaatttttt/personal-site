import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import OrchardGame from ".";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, animate: vi.fn() };
});

beforeEach(() => {
  localStorage.clear();
});

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
});
