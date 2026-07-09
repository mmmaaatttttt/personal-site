import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import PigouvianTaxChart from ".";

beforeEach(() => {
  localStorage.clear();
});

describe("PigouvianTaxChart", () => {
  it("renders without crashing", () => {
    render(<PigouvianTaxChart />);
  });

  it("renders 5 slider inputs (4 base + tax fraction)", () => {
    render(<PigouvianTaxChart />);
    expect(screen.getAllByRole("slider")).toHaveLength(5);
  });

  it("shows Coordinated and Market vertical marker labels", () => {
    render(<PigouvianTaxChart />);
    expect(screen.getByText("Coordinated")).toBeInTheDocument();
    expect(screen.getByText("Market")).toBeInTheDocument();
  });

  it("shows legend and axis labels", () => {
    render(<PigouvianTaxChart />);
    expect(screen.getByText("Company profits")).toBeInTheDocument();
    expect(screen.getAllByText("Worker income").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getByText("Share of jobs automated")).toBeInTheDocument();
  });

  it("tax fraction slider interaction does not crash", () => {
    render(<PigouvianTaxChart />);
    const sliders = screen.getAllByRole("slider");
    // Tax fraction slider is 5th (index 4)
    fireEvent.change(sliders[4], { target: { value: "1" } });
  });

  it("renders SVG chart", () => {
    const { container } = render(<PigouvianTaxChart />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
