import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import WedgeExplorer from ".";

beforeEach(() => {
  localStorage.clear();
});

function setSliders(
  savings: number,
  demandLoss: number,
  difficulty: number,
  numFirms: number,
) {
  const [savingsSlider, demandLossSlider, difficultySlider, numFirmsSlider] =
    screen.getAllByRole("slider");
  fireEvent.change(savingsSlider, { target: { value: String(savings) } });
  fireEvent.change(demandLossSlider, {
    target: { value: String(demandLoss) },
  });
  fireEvent.change(difficultySlider, {
    target: { value: String(difficulty) },
  });
  fireEvent.change(numFirmsSlider, { target: { value: String(numFirms) } });
}

describe("WedgeExplorer", () => {
  it("renders without crashing", () => {
    render(<WedgeExplorer />);
  });

  it("shows the over-automation callout", () => {
    render(<WedgeExplorer />);
    expect(
      screen.getByText(/more jobs than if firms had coordinated/i),
    ).toBeInTheDocument();
  });

  it("shows plain-English legend entries", () => {
    render(<WedgeExplorer />);
    expect(screen.getByText(/market outcome/i)).toBeInTheDocument();
    expect(screen.getByText(/coordinated outcome/i)).toBeInTheDocument();
  });

  it("renders four slider inputs", () => {
    render(<WedgeExplorer />);
    expect(screen.getAllByRole("slider")).toHaveLength(4);
  });

  it("shows the competition-drives-automation message when coordinating firms wouldn't automate", () => {
    render(<WedgeExplorer />);
    setSliders(0.6, 0.8, 0.2, 5);
    expect(screen.getByText(/competition drives/i)).toBeInTheDocument();
  });

  it("shows a singular firm count when NE matches CO exactly with one firm", () => {
    render(<WedgeExplorer />);
    setSliders(1, 0.3, 1, 1);
    expect(screen.getByText(/With 1 firm, competition/i)).toBeInTheDocument();
  });

  it("shows a plural firm count when NE matches CO exactly with multiple firms", () => {
    render(<WedgeExplorer />);
    setSliders(1, 0.2, 0.2, 3);
    expect(screen.getByText(/With 3 firms, competition/i)).toBeInTheDocument();
  });
});
