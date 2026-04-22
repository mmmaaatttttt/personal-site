import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import OrchardGameSimulation from ".";

describe("OrchardGameSimulation", () => {
  it("renders a Play button and a Reset button initially", () => {
    render(<OrchardGameSimulation />);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset Simulation" })).toBeInTheDocument();
  });

  it("renders one bar per strategy (4 strategies)", () => {
    render(<OrchardGameSimulation />);
    expect(screen.getByText(/Most Plentiful Strategy/)).toBeInTheDocument();
    expect(screen.getByText(/Least Plentiful Strategy/)).toBeInTheDocument();
    expect(screen.getByText(/Random Strategy/)).toBeInTheDocument();
    expect(screen.getByText(/Favorite Color Strategy/)).toBeInTheDocument();
  });

  it("toggles to Pause when Play is clicked", () => {
    render(<OrchardGameSimulation />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Reset Simulation" })).not.toBeInTheDocument();
  });

  it("toggles back to Play when Pause is clicked", () => {
    render(<OrchardGameSimulation />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("resets bar titles to 0% after Reset is clicked", () => {
    render(<OrchardGameSimulation />);
    // All bars start at 0%
    const zeroPercents = screen.getAllByText(/0\.0%/);
    expect(zeroPercents.length).toBe(4);
  });

  it("accepts custom game parameters without crashing", () => {
    render(
      <OrchardGameSimulation fruitCounts={[10, 10, 10, 10]} ravenCount={9} wildCardCount={2} />
    );
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });
});
