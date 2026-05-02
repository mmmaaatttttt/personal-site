import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import PAdicHeatChart from ".";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("PAdicHeatChart", () => {
  it("renders an SVG heat chart", () => {
    const { container } = render(<PAdicHeatChart />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders a prime selector dropdown", () => {
    render(<PAdicHeatChart />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows prime options in the dropdown", () => {
    render(<PAdicHeatChart />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    const options = Array.from(select.querySelectorAll("option")).map(
      (o) => o.textContent
    );
    expect(options).toContain("Selected prime: 2");
    expect(options).toContain("Selected prime: 23");
  });

  it("renders colored rectangles (the heat cells)", () => {
    const { container } = render(<PAdicHeatChart />);
    // A 25×25 lower-triangle grid has 25*26/2 = 325 non-null cells
    const rects = container.querySelectorAll("rect");
    // 325 data rects + 1 clipPath rect
    expect(rects.length).toBe(326);
  });

  it("renders the optional caption", () => {
    render(<PAdicHeatChart caption="Test caption text" />);
    expect(screen.getByText("Test caption text")).toBeInTheDocument();
  });

  it("updates the selected prime when dropdown changes", () => {
    render(<PAdicHeatChart />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "3" } });
    expect(select.value).toBe("3");
  });
});
