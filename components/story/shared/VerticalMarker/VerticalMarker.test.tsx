import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ChartContextValue } from "@/context/ChartContext";
import { ChartContext } from "@/context/ChartContext";
import VerticalMarker from ".";

const mockChart: ChartContextValue = {
  xScale: ((x: number) => x * 10) as unknown as ChartContextValue["xScale"],
  yScale: ((y: number) => y * 10) as unknown as ChartContextValue["yScale"],
  width: 600,
  height: 400,
  padding: { top: 20, bottom: 40, left: 40, right: 20 },
  gridlinesHorizontal: false,
  gridlinesVertical: false,
};

describe("VerticalMarker", () => {
  it("renders nothing outside ChartContext", () => {
    const { container } = render(
      <svg aria-label="test">
        <VerticalMarker x={5} color="#000" />
      </svg>,
    );
    expect(container.querySelector("line")).not.toBeInTheDocument();
  });

  it("renders a line inside ChartContext", () => {
    const { container } = render(
      <ChartContext.Provider value={mockChart}>
        <svg aria-label="test">
          <VerticalMarker x={5} color="#f00" />
        </svg>
      </ChartContext.Provider>,
    );
    expect(container.querySelector("line")).toBeInTheDocument();
  });

  it("renders a label when the label prop is provided", () => {
    const { container } = render(
      <ChartContext.Provider value={mockChart}>
        <svg aria-label="test">
          <VerticalMarker x={5} color="#f00" label="Event" />
        </svg>
      </ChartContext.Provider>,
    );
    expect(container.querySelector("text")).toBeInTheDocument();
  });

  it("falls back to 0 when xScale returns undefined", () => {
    const scaleReturningUndefined = (() =>
      undefined) as unknown as ChartContextValue["xScale"];
    const { container } = render(
      <ChartContext.Provider
        value={{ ...mockChart, xScale: scaleReturningUndefined }}
      >
        <svg aria-label="test">
          <VerticalMarker x={5} color="#f00" />
        </svg>
      </ChartContext.Provider>,
    );
    const line = container.querySelector("line");
    expect(line?.getAttribute("x1")).toBe("0");
  });
});
