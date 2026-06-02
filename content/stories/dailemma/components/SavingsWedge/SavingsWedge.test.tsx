import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SavingsWedge from ".";

beforeEach(() => {
  localStorage.clear();
});

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("SavingsWedge", () => {
  it("renders without crashing", () => {
    render(<SavingsWedge />);
  });

  it("shows legend entries for market outcome and social optimum", () => {
    render(<SavingsWedge />);
    expect(screen.getByText(/market outcome/i)).toBeInTheDocument();
    expect(screen.getByText(/socially optimal/i)).toBeInTheDocument();
  });

  it("shows the over-automation callout with default params", () => {
    render(<SavingsWedge />);
    expect(
      screen.getByText(/more jobs than is collectively beneficial/i),
    ).toBeInTheDocument();
  });

  it("renders three slider inputs", () => {
    render(<SavingsWedge />);
    expect(screen.getAllByRole("slider")).toHaveLength(3);
  });

  it("accepts and renders a caption", () => {
    render(<SavingsWedge caption="Test caption" />);
    expect(screen.getByText("Test caption")).toBeInTheDocument();
  });
});
