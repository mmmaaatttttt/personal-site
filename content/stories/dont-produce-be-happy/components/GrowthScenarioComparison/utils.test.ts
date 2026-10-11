import { describe, expect, it } from "vitest";
import COLORS from "@/utils/styles";
import type { EurogreenScenarioRow } from "../../data/csvData";
import {
  deriveScenarioSeries,
  SCENARIO_COLORS,
  SCENARIO_LEGEND,
} from "./utils";

const rows: EurogreenScenarioRow[] = [
  {
    scenario: "Baseline",
    year: 2015,
    gdpGrowthRate: 1.04,
    unemploymentRate: 9.98,
    co2PctOf1990: 80.48,
    giniCoefficient: 32.57,
  },
  {
    scenario: "Baseline",
    year: 2014,
    gdpGrowthRate: 1.52,
    unemploymentRate: 9.96,
    co2PctOf1990: 81.83,
    giniCoefficient: 32.73,
  },
  {
    scenario: "Degrowth",
    year: 2014,
    gdpGrowthRate: 1.52,
    unemploymentRate: 9.96,
    co2PctOf1990: 81.83,
    giniCoefficient: 32.73,
  },
];

describe("SCENARIO_COLORS / SCENARIO_LEGEND", () => {
  it("has exactly the three real Eurogreen scenarios, each with a distinct color", () => {
    expect(Object.keys(SCENARIO_COLORS)).toEqual([
      "Baseline",
      "Green Growth",
      "Degrowth",
    ]);
    const colors = Object.values(SCENARIO_COLORS);
    expect(new Set(colors).size).toBe(colors.length);
  });

  it("builds the legend directly from the color map", () => {
    expect(SCENARIO_LEGEND).toEqual([
      { text: "Baseline", color: COLORS.DARK_GRAY },
      { text: "Green Growth", color: COLORS.GREEN },
      { text: "Degrowth", color: COLORS.BLUE },
    ]);
  });
});

describe("deriveScenarioSeries", () => {
  it("returns one series per scenario, even ones absent from the rows", () => {
    const series = deriveScenarioSeries(rows, (row) => row.gdpGrowthRate);
    expect(series.map((s) => s.scenario)).toEqual([
      "Baseline",
      "Green Growth",
      "Degrowth",
    ]);
    expect(series.find((s) => s.scenario === "Green Growth")?.data).toEqual([]);
  });

  it("colors each series to match SCENARIO_COLORS", () => {
    const series = deriveScenarioSeries(rows, (row) => row.gdpGrowthRate);
    for (const s of series) {
      expect(s.color).toBe(SCENARIO_COLORS[s.scenario]);
    }
  });

  it("sorts each scenario's points by year", () => {
    const series = deriveScenarioSeries(rows, (row) => row.gdpGrowthRate);
    const baseline = series.find((s) => s.scenario === "Baseline");
    expect(baseline?.data.map((p) => p.x)).toEqual([2014, 2015]);
  });

  it("maps year to x and the accessor's result to y", () => {
    const series = deriveScenarioSeries(rows, (row) => row.unemploymentRate);
    const degrowth = series.find((s) => s.scenario === "Degrowth");
    expect(degrowth?.data).toEqual([{ x: 2014, y: 9.96 }]);
  });
});
