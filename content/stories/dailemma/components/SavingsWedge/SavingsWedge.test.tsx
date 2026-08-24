import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import SavingsWedge from ".";

function setSliders(savings: number, demandLoss: number, difficulty: number) {
  const [savingsSlider, demandLossSlider, difficultySlider] =
    screen.getAllByRole("slider");
  fireEvent.change(savingsSlider, { target: { value: String(savings) } });
  fireEvent.change(demandLossSlider, {
    target: { value: String(demandLoss) },
  });
  fireEvent.change(difficultySlider, {
    target: { value: String(difficulty) },
  });
}

beforeEach(() => {
  localStorage.clear();
});

describe("SavingsWedge", () => {
  it("renders without crashing", () => {
    render(<SavingsWedge />);
  });

  it("shows legend entries for market outcome and coordinated outcome", () => {
    render(<SavingsWedge />);
    expect(screen.getByText(/market outcome/i)).toBeInTheDocument();
    expect(screen.getByText(/coordinated outcome/i)).toBeInTheDocument();
  });

  it("shows the over-automation callout with default params", () => {
    render(<SavingsWedge />);
    expect(
      screen.getByText(/more jobs than if firms had coordinated/i),
    ).toBeInTheDocument();
  });

  it("renders three slider inputs", () => {
    render(<SavingsWedge />);
    expect(screen.getAllByRole("slider")).toHaveLength(3);
  });

  it("shows the no-automation message when neither NE nor CO would automate", () => {
    render(<SavingsWedge />);
    setSliders(0.1, 0.8, 0);
    expect(
      screen.getByText(
        /neither competing firms nor coordinating firms\s+would automate/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows the competition-drives-automation message when only NE would automate", () => {
    render(<SavingsWedge />);
    setSliders(0.6, 0.8, 0);
    expect(screen.getByText(/competing firms\s+drive/i)).toBeInTheDocument();
  });

  it("shows the same-outcome message when NE matches CO exactly", () => {
    render(<SavingsWedge />);
    setSliders(1, 0.5, 0);
    expect(
      screen.getByText(/competition delivers the same outcome/i),
    ).toBeInTheDocument();
  });

  it("shows a negative delta label when savings are below demand loss", () => {
    render(<SavingsWedge />);
    setSliders(0.1, 0.8, 0);
    expect(screen.getByText("-0.70")).toBeInTheDocument();
  });
});
