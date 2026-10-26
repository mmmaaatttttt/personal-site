import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { scaleLinear } from "d3-scale";
import { describe, expect, it } from "vitest";
import type { SliderData } from "@/hooks/useSliders";
import ChartFrame from ".";

const xScale = scaleLinear().domain([0, 10]).range([0, 100]);
const yScale = scaleLinear().domain([0, 10]).range([100, 0]);
const graphPadding = { top: 10, bottom: 10, left: 10, right: 10 };

const sliderData: SliderData[] = [
  {
    initialValue: 2020,
    min: 2020,
    max: 2025,
    step: 1,
    title: "Year",
    color: "#000000",
    value: 2020,
    handleValueChange: () => {},
  },
];

describe("ChartFrame", () => {
  it("renders the slider, axis labels, and children inside the graph", () => {
    render(
      <ChartFrame
        containerWidth="50%"
        width={200}
        height={200}
        graphPadding={graphPadding}
        xScale={xScale}
        yScale={yScale}
        xTickFormat=","
        yTickFormat=","
        xAxisLabel="X Label"
        yAxisLabel="Y Label"
        sliderData={sliderData}
      >
        {() => <circle data-testid="child" cx={1} cy={1} r={1} />}
      </ChartFrame>,
    );

    expect(screen.getByRole("slider")).toBeInTheDocument();
    expect(screen.getByText("X Label")).toBeInTheDocument();
    expect(screen.getByText("Y Label")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("does not render a toolbar slot when none is given", () => {
    render(
      <ChartFrame
        containerWidth="50%"
        width={200}
        height={200}
        graphPadding={graphPadding}
        xScale={xScale}
        yScale={yScale}
        xTickFormat=","
        yTickFormat=","
        xAxisLabel="X"
        yAxisLabel="Y"
        sliderData={sliderData}
      >
        {() => null}
      </ChartFrame>,
    );

    expect(screen.queryByTestId("toolbar")).not.toBeInTheDocument();
  });

  it("renders the toolbar when provided", () => {
    render(
      <ChartFrame
        containerWidth="50%"
        width={200}
        height={200}
        graphPadding={graphPadding}
        xScale={xScale}
        yScale={yScale}
        xTickFormat=","
        yTickFormat=","
        xAxisLabel="X"
        yAxisLabel="Y"
        sliderData={sliderData}
        toolbar={<div data-testid="toolbar">Toolbar</div>}
      >
        {() => null}
      </ChartFrame>,
    );

    expect(screen.getByTestId("toolbar")).toBeInTheDocument();
  });

  it("exposes tooltip show/hide helpers to children", () => {
    render(
      <ChartFrame
        containerWidth="50%"
        width={200}
        height={200}
        graphPadding={graphPadding}
        xScale={xScale}
        yScale={yScale}
        xTickFormat=","
        yTickFormat=","
        xAxisLabel="X"
        yAxisLabel="Y"
        sliderData={sliderData}
      >
        {({ showTooltip, hideTooltip }) => (
          // biome-ignore lint/a11y/useSemanticElements: SVG circle cannot be replaced with <button>
          <circle
            role="button"
            tabIndex={0}
            r={1}
            cx={1}
            cy={1}
            onMouseEnter={showTooltip("Title", ["Body"])}
            onMouseLeave={hideTooltip}
          />
        )}
      </ChartFrame>,
    );

    const point = screen.getByRole("button");
    fireEvent.mouseEnter(point);
    expect(document.querySelector(".fixed.z-50")).not.toBeNull();

    fireEvent.mouseLeave(point);
    expect(document.querySelector(".fixed.z-50")).toBeNull();
  });
});
