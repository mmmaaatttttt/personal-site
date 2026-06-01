import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WelfareChart from ".";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("WelfareChart", () => {
  it("renders without crashing", () => {
    render(<WelfareChart />);
  });

  it("shows legend entries for company profits and worker income", () => {
    render(<WelfareChart />);
    expect(screen.getByText(/company profits/i)).toBeInTheDocument();
    expect(screen.getByText(/worker income/i)).toBeInTheDocument();
  });

  it("shows plain-English social optimum and market outcome labels", () => {
    render(<WelfareChart />);
    expect(screen.getByText(/social optimum/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/market outcome/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders five slider inputs", () => {
    render(<WelfareChart />);
    expect(screen.getAllByRole("slider")).toHaveLength(5);
  });

  it("renders four slider inputs when numFirms is fixed", () => {
    render(<WelfareChart numFirms={2} />);
    expect(screen.getAllByRole("slider")).toHaveLength(4);
  });

  it("accepts and renders a caption", () => {
    render(<WelfareChart caption="Test caption" />);
    expect(screen.getByText("Test caption")).toBeInTheDocument();
  });
});
