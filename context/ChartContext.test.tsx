import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { scaleLinear } from "d3-scale";
import { ChartContext, useChart } from "./ChartContext";

const xScale = scaleLinear().domain([0, 100]).range([0, 600]);
const yScale = scaleLinear().domain([0, 100]).range([600, 0]);
const padding = { top: 20, bottom: 40, left: 50, right: 10 };

const contextValue = {
  xScale,
  yScale,
  width: 600,
  height: 600,
  padding,
  gridlinesHorizontal: true,
  gridlinesVertical: false,
};

function ChartConsumer() {
  const chart = useChart();
  if (!chart) return <div data-testid="no-context">no context</div>;
  return (
    <div>
      <span data-testid="width">{chart.width}</span>
      <span data-testid="height">{chart.height}</span>
      <span data-testid="padding-left">{chart.padding.left}</span>
      <span data-testid="gridlines-h">{String(chart.gridlinesHorizontal)}</span>
      <span data-testid="gridlines-v">{String(chart.gridlinesVertical)}</span>
    </div>
  );
}

describe("ChartContext", () => {
  it("useChart returns null outside a provider", () => {
    render(<ChartConsumer />);
    expect(screen.getByTestId("no-context")).toBeInTheDocument();
  });

  it("useChart returns context value inside a provider", () => {
    render(
      <ChartContext.Provider value={contextValue}>
        <ChartConsumer />
      </ChartContext.Provider>,
    );
    expect(screen.getByTestId("width")).toHaveTextContent("600");
    expect(screen.getByTestId("height")).toHaveTextContent("600");
    expect(screen.getByTestId("padding-left")).toHaveTextContent("50");
    expect(screen.getByTestId("gridlines-h")).toHaveTextContent("true");
    expect(screen.getByTestId("gridlines-v")).toHaveTextContent("false");
  });

  it("xScale and yScale are accessible via context", () => {
    const results: { x: number; y: number } = { x: -1, y: -1 };
    function Capture() {
      const chart = useChart();
      if (chart) {
        results.x = (chart.xScale(50) as number) ?? -1;
        results.y = (chart.yScale(50) as number) ?? -1;
      }
      return null;
    }
    render(
      <ChartContext.Provider value={contextValue}>
        <Capture />
      </ChartContext.Provider>,
    );
    expect(results.x).toBeCloseTo(300);
    expect(results.y).toBeCloseTo(300);
  });
});
