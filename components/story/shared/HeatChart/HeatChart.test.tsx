import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import HeatChart from ".";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// 2-column × 2-row matrix of plain numbers
const data: (number | null)[][] = [
  [0.5, 1.0],
  [0.25, null],
];

const baseProps = {
  data,
  accessor: (d: number) => d,
  getTooltipBody: (d: number, x: number, y: number) => [
    `val=${d}`, `x=${x}`, `y=${y}`,
  ],
  colorDomain: [0, 1],
  colorRange: ["#0000ff", "#000000"],
  xAxisLabel: "X Label",
  yAxisLabel: "Y Label",
};

describe("HeatChart", () => {
  it("renders an SVG", () => {
    const { container } = render(<HeatChart {...baseProps} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders one rect per non-null data point", () => {
    const { container } = render(<HeatChart {...baseProps} />);
    const rects = container.querySelectorAll("rect");
    // 3 data rects + 1 clipPath rect
    expect(rects.length).toBe(4);
  });

  it("renders axis labels when axes=true (default)", () => {
    render(<HeatChart {...baseProps} />);
    expect(screen.getByText("X Label")).toBeInTheDocument();
    expect(screen.getByText("Y Label")).toBeInTheDocument();
  });

  it("hides axis labels when axes=false", () => {
    render(<HeatChart {...baseProps} axes={false} />);
    expect(screen.queryByText("X Label")).not.toBeInTheDocument();
    expect(screen.queryByText("Y Label")).not.toBeInTheDocument();
  });

  it("skips null cells", () => {
    const sparse: (number | null)[][] = [[null, null], [null, 0.5]];
    const { container } = render(<HeatChart {...baseProps} data={sparse} />);
    const rects = container.querySelectorAll("rect");
    // 1 data rect + 1 clipPath rect
    expect(rects.length).toBe(2);
  });

  it("accepts custom paddingScale without crashing", () => {
    const { container } = render(<HeatChart {...baseProps} paddingScale={0.01} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
