import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { writeMemoryItem } from "@/hooks/useMemoryStore";
import { DEMAND_LOSS_KEY, SAVINGS_KEY } from "../../sliderStore";
import CoordinationGame from ".";

describe("CoordinationGame", () => {
  it("renders without crashing", () => {
    render(<CoordinationGame />);
  });

  it("shows market outcome label in the Automate-Automate cell with default params", () => {
    render(<CoordinationGame />);
    expect(screen.getByText("Where both firms end up")).toBeInTheDocument();
  });

  it("shows Better for both label in the Don't-Don't cell when in PD regime", () => {
    act(() => {
      writeMemoryItem(SAVINGS_KEY, 0.4);
      writeMemoryItem(DEMAND_LOSS_KEY, 0.6);
    });
    render(<CoordinationGame />);
    expect(screen.getByText("Better for both")).toBeInTheDocument();
  });

  it("renders four payoff cells", () => {
    render(<CoordinationGame />);
    expect(screen.getAllByText(/[+-]?\d+\.\d+%/).length).toBeGreaterThanOrEqual(
      4,
    );
  });

  it("accepts and renders a caption", () => {
    render(<CoordinationGame caption="Test caption" />);
    expect(screen.getByText("Test caption")).toBeInTheDocument();
  });

  it("renders two slider inputs", () => {
    render(<CoordinationGame />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });
});
