import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ChartContextValue } from "@/context/ChartContext";
import { ChartContext } from "@/context/ChartContext";
import COLORS from "@/utils/styles";
import TrueRateMarker from "./TrueRateMarker";

const mockChart: ChartContextValue = {
  xScale: ((x: number) => x * 10) as unknown as ChartContextValue["xScale"],
  yScale: ((y: number) => y * 20) as unknown as ChartContextValue["yScale"],
  width: 600,
  height: 400,
  padding: { top: 20, bottom: 40, left: 40, right: 20 },
  gridlinesHorizontal: false,
  gridlinesVertical: false,
};

describe("TrueRateMarker", () => {
  it("renders nothing outside ChartContext", () => {
    const { container } = render(
      <svg aria-label="test">
        <TrueRateMarker trueResponseRate={0.5} />
      </svg>,
    );
    expect(container.querySelector("circle")).not.toBeInTheDocument();
  });

  it("renders a circle at (trueResponseRate, trueResponseRate) via the chart scales", () => {
    const { container } = render(
      <ChartContext.Provider value={mockChart}>
        <svg aria-label="test">
          <TrueRateMarker trueResponseRate={0.5} />
        </svg>
      </ChartContext.Provider>,
    );
    const circle = container.querySelector("circle");
    expect(circle).toHaveAttribute("cx", "5");
    expect(circle).toHaveAttribute("cy", "10");
    expect(circle).toHaveAttribute("fill", COLORS.DARK_GRAY);
  });

  it("falls back cx to 0 when xScale returns undefined", () => {
    const scaleReturningUndefined = (() =>
      undefined) as unknown as ChartContextValue["xScale"];
    const { container } = render(
      <ChartContext.Provider
        value={{ ...mockChart, xScale: scaleReturningUndefined }}
      >
        <svg aria-label="test">
          <TrueRateMarker trueResponseRate={0.5} />
        </svg>
      </ChartContext.Provider>,
    );
    expect(container.querySelector("circle")).toHaveAttribute("cx", "0");
  });

  it("falls back cy to 0 when yScale returns undefined", () => {
    const scaleReturningUndefined = (() =>
      undefined) as unknown as ChartContextValue["yScale"];
    const { container } = render(
      <ChartContext.Provider
        value={{ ...mockChart, yScale: scaleReturningUndefined }}
      >
        <svg aria-label="test">
          <TrueRateMarker trueResponseRate={0.5} />
        </svg>
      </ChartContext.Provider>,
    );
    expect(container.querySelector("circle")).toHaveAttribute("cy", "0");
  });
});
