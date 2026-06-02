import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import CoordinationGame from ".";

beforeEach(() => {
  localStorage.clear();
});

describe("CoordinationGame", () => {
  it("renders without crashing", () => {
    render(<CoordinationGame />);
  });

  it("shows market outcome label in the Automate-Automate cell with default params", () => {
    render(<CoordinationGame />);
    expect(screen.getByText("Where both firms end up")).toBeInTheDocument();
  });

  it("shows Better for both label in the Don't-Don't cell when in PD regime", () => {
    localStorage.setItem("dailemma-savings", JSON.stringify(0.4));
    localStorage.setItem("dailemma-demandLoss", JSON.stringify(0.6));
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
