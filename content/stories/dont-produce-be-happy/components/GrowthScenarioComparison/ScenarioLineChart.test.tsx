import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import COLORS from "@/utils/styles";
import ScenarioLineChart from "./ScenarioLineChart";

const series = [
  {
    scenario: "Baseline" as const,
    color: COLORS.DARK_GRAY,
    data: [
      { x: 2014, y: 1.52 },
      { x: 2050, y: 0.89 },
    ],
  },
  {
    scenario: "Green Growth" as const,
    color: COLORS.GREEN,
    data: [
      { x: 2014, y: 1.52 },
      { x: 2050, y: 0.86 },
    ],
  },
  {
    scenario: "Degrowth" as const,
    color: COLORS.BLUE,
    data: [
      { x: 2014, y: 1.52 },
      { x: 2050, y: -0.71 },
    ],
  },
];

describe("ScenarioLineChart", () => {
  it("renders one chart with one line per scenario", () => {
    render(
      <ScenarioLineChart
        svgId="test-chart"
        series={series}
        yDomain={[-1, 2]}
        yAxisLabel="GDP growth rate (%)"
      />,
    );
    expect(document.querySelectorAll("svg")).toHaveLength(1);
    expect(document.querySelectorAll("path:not(.domain)")).toHaveLength(3);
  });

  it("colors each line by its scenario's color", () => {
    render(
      <ScenarioLineChart
        svgId="test-chart"
        series={series}
        yDomain={[-1, 2]}
        yAxisLabel="GDP growth rate (%)"
      />,
    );
    expect(
      document.querySelector(`path[stroke="${COLORS.DARK_GRAY}"]`),
    ).not.toBeNull();
    expect(
      document.querySelector(`path[stroke="${COLORS.GREEN}"]`),
    ).not.toBeNull();
    expect(
      document.querySelector(`path[stroke="${COLORS.BLUE}"]`),
    ).not.toBeNull();
  });

  it("renders the given y-axis label, so different charts can show different labels", () => {
    render(
      <ScenarioLineChart
        svgId="test-chart"
        series={series}
        yDomain={[-1, 2]}
        yAxisLabel="GDP growth rate (%)"
      />,
    );
    expect(screen.getByText("GDP growth rate (%)")).toBeInTheDocument();
  });
});
