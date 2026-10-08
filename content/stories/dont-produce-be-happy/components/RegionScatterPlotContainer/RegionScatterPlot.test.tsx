import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { scaleLinear } from "d3-scale";
import { describe, expect, it } from "vitest";
import type { SliderData } from "@/hooks/useSliders";
import RegionScatterPlot, {
  type RegionScatterPoint,
} from "./RegionScatterPlot";

const xScale = scaleLinear().domain([0, 100]).range([0, 200]);
const yScale = scaleLinear().domain([0, 100]).range([200, 0]);
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

const data: RegionScatterPoint[] = [
  {
    cx: 10,
    cy: 20,
    radius: 8,
    fill: "#ff8f34",
    stroke: "#b35f1e",
    strokeWidth: 1,
    opacity: 1,
    label: "United States",
    key: "United States",
    ariaLabel: "United States, GDP per capita $10, Life Ladder 20",
    tooltipBody: ["$10 per capita", "20.00"],
  },
  {
    cx: 50,
    cy: 60,
    radius: 8,
    fill: "#2e7d32",
    stroke: "#1f5422",
    strokeWidth: 1,
    opacity: 0.4,
    label: "Kenya",
    key: "Kenya",
    ariaLabel: "Kenya, GDP per capita $50, Life Ladder 60",
    tooltipBody: ["$50 per capita", "60.00"],
  },
];

describe("RegionScatterPlot", () => {
  it("renders one point per entry with its region legend", () => {
    render(
      <RegionScatterPlot
        data={data}
        sliderData={sliderData}
        width={400}
        height={400}
        graphPadding={graphPadding}
        xScale={xScale}
        yScale={yScale}
        xTickFormat=","
        yTickFormat=","
        xAxisLabel="X"
        yAxisLabel="Y"
        containerWidth="75%"
      />,
    );

    expect(document.querySelectorAll("circle")).toHaveLength(2);
    expect(screen.getByText("North America")).toBeInTheDocument();
    expect(screen.getByText("Asia")).toBeInTheDocument();
  });

  it("colors and dims points as given, with the aria-label passed through verbatim", () => {
    render(
      <RegionScatterPlot
        data={data}
        sliderData={sliderData}
        width={400}
        height={400}
        graphPadding={graphPadding}
        xScale={xScale}
        yScale={yScale}
        xTickFormat=","
        yTickFormat=","
        xAxisLabel="X"
        yAxisLabel="Y"
        containerWidth="75%"
      />,
    );

    const us = screen.getByRole("button", { name: /United States/ });
    const kenya = screen.getByRole("button", { name: /Kenya/ });

    expect(us.getAttribute("fill")).not.toBe(kenya.getAttribute("fill"));
    expect(us.getAttribute("opacity")).toBe("1");
    expect(Number(kenya.getAttribute("opacity"))).toBeLessThan(1);
  });

  it("shows the tooltip body on focus and hides it on blur", () => {
    render(
      <RegionScatterPlot
        data={data}
        sliderData={sliderData}
        width={400}
        height={400}
        graphPadding={graphPadding}
        xScale={xScale}
        yScale={yScale}
        xTickFormat=","
        yTickFormat=","
        xAxisLabel="X"
        yAxisLabel="Y"
        containerWidth="75%"
      />,
    );

    const point = screen.getByRole("button", { name: /United States/ });

    fireEvent.focus(point);
    const tooltip = document.querySelector(".fixed.z-50");
    expect(tooltip).not.toBeNull();
    expect(tooltip).toHaveTextContent("United States");
    expect(tooltip).toHaveTextContent("$10 per capita");

    fireEvent.blur(point);
    expect(document.querySelector(".fixed.z-50")).toBeNull();
  });
});
