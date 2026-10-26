import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import COLORS from "@/utils/styles";
import ScenarioLineChart from "./ScenarioLineChart";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    animate: vi.fn(
      (
        _from: number,
        to: number,
        options?: { onUpdate?: (value: number) => void },
      ) => {
        options?.onUpdate?.(to);
        return { stop: vi.fn() };
      },
    ),
  };
});

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
        yTickFormat="+.1%"
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
        yTickFormat="+.1%"
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
        yTickFormat="+.1%"
      />,
    );
    expect(screen.getByText("GDP growth rate (%)")).toBeInTheDocument();
  });

  it("formats y-axis ticks as a percentage when given a fraction and a % format", () => {
    render(
      <ScenarioLineChart
        svgId="test-chart"
        series={series}
        yDomain={[0, 0.15]}
        yAxisLabel="Unemployment rate"
        yTickFormat=".0%"
      />,
    );
    expect(screen.getByText("10%")).toBeInTheDocument();
  });

  it("leaves y-axis ticks as plain numbers for a non-percentage format", () => {
    render(
      <ScenarioLineChart
        svgId="test-chart"
        series={series}
        yDomain={[0, 450]}
        yAxisLabel="CO2 Emissions (Mt)"
        yTickFormat=","
      />,
    );
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.queryByText("400%")).not.toBeInTheDocument();
  });

  it("draws no background shading behind the scenario lines", () => {
    render(
      <ScenarioLineChart
        svgId="test-chart"
        series={series}
        yDomain={[-1, 2]}
        yAxisLabel="GDP growth rate (%)"
        yTickFormat="+.1%"
      />,
    );
    expect(
      document.querySelector(`rect[fill="${COLORS.LIGHT_GRAY}"]`),
    ).toBeNull();
  });

  it("renders an empty path, not a crash, for a scenario with no data points", () => {
    const seriesWithMissingScenario = series.map((s) =>
      s.scenario === "Degrowth" ? { ...s, data: [] } : s,
    );
    render(
      <ScenarioLineChart
        svgId="test-chart"
        series={seriesWithMissingScenario}
        yDomain={[-1, 2]}
        yAxisLabel="GDP growth rate (%)"
        yTickFormat="+.1%"
      />,
    );
    expect(document.querySelectorAll("path:not(.domain)")).toHaveLength(3);
    expect(
      document.querySelector(`path[stroke="${COLORS.BLUE}"]`),
    ).toHaveAttribute("d", "");
  });
});
