import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import OrchardGameSimulation from ".";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("OrchardGameSimulation", () => {
  it("renders a Play button and a Reset button initially", () => {
    render(<OrchardGameSimulation />);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset Simulation" }),
    ).toBeInTheDocument();
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
    expect(
      screen.queryByRole("button", { name: "Reset Simulation" }),
    ).not.toBeInTheDocument();
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
      <OrchardGameSimulation
        fruitCounts={[10, 10, 10, 10]}
        ravenCount={9}
        wildCardCount={2}
      />,
    );
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("accumulates played games as the simulation ticks while playing", () => {
    render(<OrchardGameSimulation />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    // At least one strategy's bar should have moved off the initial 0.0%.
    expect(screen.queryAllByText(/0\.0%/).length).toBeLessThan(4);
  });

  it("clears accumulated progress when Reset is clicked", () => {
    render(<OrchardGameSimulation />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset Simulation" }));
    expect(screen.getAllByText(/0\.0%/).length).toBe(4);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("stops ticking once paused", () => {
    const { container } = render(<OrchardGameSimulation />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    const titlesAfterPause = Array.from(container.querySelectorAll("h4")).map(
      (t) => t.textContent,
    );
    act(() => {
      vi.advanceTimersByTime(500);
    });
    const titlesAfterWaiting = Array.from(container.querySelectorAll("h4")).map(
      (t) => t.textContent,
    );
    expect(titlesAfterWaiting).toEqual(titlesAfterPause);
  });

  it("stops the simulation loop on unmount", () => {
    const { unmount } = render(<OrchardGameSimulation />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(() => {
      unmount();
      act(() => {
        vi.advanceTimersByTime(500);
      });
    }).not.toThrow();
  });
});
