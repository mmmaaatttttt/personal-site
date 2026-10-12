import { describe, expect, it } from "vitest";
import COLORS from "@/utils/styles";
import type { EurogreenScenarioRow } from "../../data/csvData";
import {
  deriveScenarioSeries,
  SCENARIO_COLORS,
  SCENARIO_LEGEND,
  VARIABLE_OPTIONS,
} from "./utils";

const rows = [
  {
    scenario: "Baseline",
    year: 2015,
    gdpGrowthRate: 1.04,
    unemploymentRate: 9.98,
    co2EmissionsMt: 421.31,
    giniCoefficient: 0.3257,
    governmentDeficitPctGdp: 3.5,
  },
  {
    scenario: "Baseline",
    year: 2014,
    gdpGrowthRate: 1.52,
    unemploymentRate: 9.96,
    co2EmissionsMt: 428.38,
    giniCoefficient: 0.3273,
    governmentDeficitPctGdp: 3.9,
  },
  {
    scenario: "Degrowth",
    year: 2014,
    gdpGrowthRate: 1.52,
    unemploymentRate: 9.96,
    co2EmissionsMt: 428.38,
    giniCoefficient: 0.3273,
    governmentDeficitPctGdp: 3.9,
  },
] as unknown as EurogreenScenarioRow[];

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

describe("VARIABLE_OPTIONS", () => {
  it("has a distinct value and label for each of the 5 available variables", () => {
    expect(VARIABLE_OPTIONS).toHaveLength(5);
    const values = VARIABLE_OPTIONS.map((option) => option.value);
    const labels = VARIABLE_OPTIONS.map((option) => option.label);
    expect(new Set(values).size).toBe(VARIABLE_OPTIONS.length);
    expect(new Set(labels).size).toBe(VARIABLE_OPTIONS.length);
  });

  it("gives every option an accessor that reads a real field off a row", () => {
    const row = rows[0];
    for (const option of VARIABLE_OPTIONS) {
      expect(typeof option.accessor(row)).toBe("number");
    }
  });

  it("divides rate-based options by 100 so they're true fractions for d3's % format", () => {
    const row = rows[0];
    const gdpGrowth = VARIABLE_OPTIONS.find(
      (option) => option.value === "gdp-growth",
    );
    const unemployment = VARIABLE_OPTIONS.find(
      (option) => option.value === "unemployment",
    );
    const deficit = VARIABLE_OPTIONS.find(
      (option) => option.value === "deficit",
    );
    expect(gdpGrowth?.accessor(row)).toBeCloseTo(row.gdpGrowthRate / 100);
    expect(unemployment?.accessor(row)).toBeCloseTo(row.unemploymentRate / 100);
    expect(deficit?.accessor(row)).toBeCloseTo(
      row.governmentDeficitPctGdp / 100,
    );
  });

  it("leaves non-rate options (CO2, Gini) at their raw value", () => {
    const row = rows[0];
    const co2 = VARIABLE_OPTIONS.find((option) => option.value === "co2");
    const gini = VARIABLE_OPTIONS.find((option) => option.value === "gini");
    expect(co2?.accessor(row)).toBe(row.co2EmissionsMt);
    expect(gini?.accessor(row)).toBe(row.giniCoefficient);
  });
});
