import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import type { EurogreenScenarioRow } from "../../data/csvData";
import GrowthScenarioComparison from ".";

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

const rows = [
  {
    scenario: "Baseline",
    year: 2014,
    gdpGrowthRate: 1.5228,
    unemploymentRate: 9.9598,
    co2EmissionsMt: 428.38,
    giniCoefficient: 0.3273,
    governmentDeficitPctGdp: 3.8973,
  },
  {
    scenario: "Baseline",
    year: 2050,
    gdpGrowthRate: 0.8933,
    unemploymentRate: 11.4053,
    co2EmissionsMt: 237.476,
    giniCoefficient: 0.343,
    governmentDeficitPctGdp: 2.1,
  },
  {
    scenario: "Green Growth",
    year: 2014,
    gdpGrowthRate: 1.5228,
    unemploymentRate: 9.9598,
    co2EmissionsMt: 428.38,
    giniCoefficient: 0.3273,
    governmentDeficitPctGdp: 3.8973,
  },
  {
    scenario: "Green Growth",
    year: 2050,
    gdpGrowthRate: 0.8598,
    unemploymentRate: 12.7744,
    co2EmissionsMt: 118.7613,
    giniCoefficient: 0.3523,
    governmentDeficitPctGdp: 1.8,
  },
  {
    scenario: "Degrowth",
    year: 2014,
    gdpGrowthRate: 1.5228,
    unemploymentRate: 9.9598,
    co2EmissionsMt: 428.38,
    giniCoefficient: 0.3273,
    governmentDeficitPctGdp: 3.8973,
  },
  {
    scenario: "Degrowth",
    year: 2050,
    gdpGrowthRate: -0.7139,
    unemploymentRate: 7.0563,
    co2EmissionsMt: 93.2811,
    giniCoefficient: 0.2392,
    governmentDeficitPctGdp: 0.8,
  },
] as unknown as EurogreenScenarioRow[];

function getChartSvg() {
  const svg = document.querySelector<SVGSVGElement>(
    'svg[aria-label="eurogreen-scenario-chart"]',
  );
  if (!svg) throw new Error("chart svg not found");
  return svg;
}

describe("GrowthScenarioComparison", () => {
  it("renders one chart, a legend entry for each scenario, and a variable dropdown", () => {
    render(<GrowthScenarioComparison rows={rows} />);
    expect(
      document.querySelectorAll('svg[aria-label="eurogreen-scenario-chart"]'),
    ).toHaveLength(1);
    expect(screen.getByText("Baseline")).toBeInTheDocument();
    expect(screen.getByText("Green Growth")).toBeInTheDocument();
    expect(screen.getByText("Degrowth")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders 3 lines (one per scenario) for the default variable", () => {
    render(<GrowthScenarioComparison rows={rows} />);
    expect(getChartSvg().querySelectorAll("path:not(.domain)")).toHaveLength(3);
  });

  it("re-renders the chart with different data when a different variable is selected", () => {
    render(<GrowthScenarioComparison rows={rows} />);
    const pathsBefore = Array.from(
      getChartSvg().querySelectorAll("path:not(.domain)"),
    ).map((p) => p.getAttribute("d"));

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "co2" },
    });

    const pathsAfter = Array.from(
      getChartSvg().querySelectorAll("path:not(.domain)"),
    ).map((p) => p.getAttribute("d"));
    expect(pathsAfter).not.toEqual(pathsBefore);
  });

  it("shows the selected variable's label as the chart's y-axis label", () => {
    render(<GrowthScenarioComparison rows={rows} />);
    const chartTexts = () =>
      Array.from(getChartSvg().querySelectorAll("text")).map(
        (el) => el.textContent,
      );
    expect(chartTexts()).toContain("GDP growth rate");

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "gini" },
    });
    expect(chartTexts()).toContain("Gini coefficient");
  });
});
