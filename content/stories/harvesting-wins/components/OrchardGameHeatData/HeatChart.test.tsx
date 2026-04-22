import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import HeatChart from "./HeatChart";
import type { OrchardDataPoint } from "../../data";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const makePoint = (fruits: number, ravenCount: number): OrchardDataPoint => ({
  colors: 4,
  fruits,
  ravenCount,
  wildCardCount: 1,
  probs: { mostPlentiful: 0.6, leastPlentiful: 0.5, random: 0.55, favoriteColor: 0.52 },
});

// 2-column × 2-row matrix
const data: (OrchardDataPoint | null)[][] = [
  [makePoint(1, 1), makePoint(2, 1)],
  [makePoint(1, 2), makePoint(2, 2)],
];

const baseProps = {
  data,
  accessor: (d: OrchardDataPoint) => d.probs.mostPlentiful,
  getTooltipBody: (_d: OrchardDataPoint, _x: number, _y: number) => ["tip"],
  colorDomain: [0, 1],
  colorRange: ["#000000", "#ffffff"],
  xAxisLabel: "Raven Count",
  yAxisLabel: "Fruits per Color",
};

describe("HeatChart", () => {
  it("renders an SVG", () => {
    const { container } = render(<HeatChart {...baseProps} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders one rect per non-null data point", () => {
    const { container } = render(<HeatChart {...baseProps} />);
    const rects = container.querySelectorAll("rect");
    // 4 data rects + 1 clipPath rect
    expect(rects.length).toBe(5);
  });

  it("renders axis labels", () => {
    render(<HeatChart {...baseProps} />);
    expect(screen.getByText("Raven Count")).toBeInTheDocument();
    expect(screen.getByText("Fruits per Color")).toBeInTheDocument();
  });

  it("skips null cells", () => {
    const sparseData: (OrchardDataPoint | null)[][] = [
      [makePoint(1, 1), null],
      [null, makePoint(2, 2)],
    ];
    const { container } = render(<HeatChart {...baseProps} data={sparseData} />);
    const rects = container.querySelectorAll("rect");
    // 2 data rects + 1 clipPath rect
    expect(rects.length).toBe(3);
  });
});
