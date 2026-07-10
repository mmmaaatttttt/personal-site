import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import WorkerEquityChart from ".";

beforeEach(() => {
  localStorage.clear();
});

describe("WorkerEquityChart", () => {
  it("renders without crashing", () => {
    render(<WorkerEquityChart />);
  });

  it("renders 6 slider inputs (4 base + equity share + sector spending)", () => {
    render(<WorkerEquityChart />);
    expect(screen.getAllByRole("slider")).toHaveLength(6);
  });

  it("shows Coordinated and Market vertical marker labels", () => {
    render(<WorkerEquityChart />);
    expect(screen.getByText("Coordinated")).toBeInTheDocument();
    expect(screen.getByText("Market")).toBeInTheDocument();
  });

  it("shows legend and axis labels", () => {
    render(<WorkerEquityChart />);
    expect(screen.getByText("Company profits")).toBeInTheDocument();
    expect(screen.getAllByText("Worker income").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getAllByText("With equity").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Share of jobs automated")).toBeInTheDocument();
  });

  it("equity slider interaction does not crash", () => {
    render(<WorkerEquityChart />);
    const sliders = screen.getAllByRole("slider");
    // The equity share slider is the 5th (index 4)
    fireEvent.change(sliders[4], { target: { value: "0.8" } });
  });

  it("sector spending slider interaction does not crash", () => {
    render(<WorkerEquityChart />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.change(sliders[5], { target: { value: "0.9" } });
  });
});
