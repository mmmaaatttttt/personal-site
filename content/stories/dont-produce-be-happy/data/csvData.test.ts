import { describe, expect, it } from "vitest";
import {
  eurogreenFranceScenarios,
  gdpHappinessByCountryYear,
  healthOutcomesByYear,
  socialShortfallByCountry,
} from "./csvData";

describe("gdpHappinessByCountryYear", () => {
  it("has one row per country per year, 2014-2025", () => {
    expect(gdpHappinessByCountryYear).toHaveLength(1524);
  });

  it("parses numeric fields as numbers", () => {
    const row = gdpHappinessByCountryYear[0];
    expect(typeof row.year).toBe("number");
    expect(typeof row.gdpPerCapita).toBe("number");
    expect(typeof row.lifeLadder).toBe("number");
  });

  it("has no gap years for any country", () => {
    const countries = new Set(gdpHappinessByCountryYear.map((r) => r.country));
    for (const country of countries) {
      const years = gdpHappinessByCountryYear
        .filter((r) => r.country === country)
        .map((r) => r.year)
        .sort((a, b) => a - b);
      expect(years).toEqual([
        2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
      ]);
    }
  });

  it("includes the United States with a plausible GDP and score", () => {
    const us2025 = gdpHappinessByCountryYear.find(
      (r) => r.country === "United States" && r.year === 2025,
    );
    expect(us2025?.gdpPerCapita).toBeGreaterThan(50000);
    expect(us2025?.lifeLadder).toBeGreaterThan(0);
    expect(us2025?.lifeLadder).toBeLessThanOrEqual(10);
    expect(us2025?.region).toBe("North America");
  });

  it("assigns a real region to every row", () => {
    const regions = new Set(gdpHappinessByCountryYear.map((r) => r.region));
    expect(regions).toEqual(
      new Set([
        "Europe",
        "North America",
        "South America",
        "Asia",
        "Africa",
        "Oceania",
      ]),
    );
  });
});

describe("healthOutcomesByYear", () => {
  it("has one row per country per year, 2000-2023", () => {
    expect(healthOutcomesByYear).toHaveLength(1248);
  });

  it("parses numeric fields as numbers", () => {
    const row = healthOutcomesByYear[0];
    expect(typeof row.year).toBe("number");
    expect(typeof row.healthSpendingPerCapita).toBe("number");
    expect(typeof row.lifeExpectancy).toBe("number");
  });

  it("includes the United States with a real region", () => {
    const us = healthOutcomesByYear.find(
      (row) => row.country === "United States" && row.year === 2023,
    );
    expect(us?.region).toBe("North America");
    expect(us?.healthSpendingPerCapita).toBeGreaterThan(0);
  });
});

describe("socialShortfallByCountry", () => {
  it("has 81 countries with complete 2015 data", () => {
    expect(socialShortfallByCountry).toHaveLength(81);
  });

  it("parses numeric fields as numbers", () => {
    const row = socialShortfallByCountry[0];
    expect(typeof row.socialThresholdsAchieved).toBe("number");
    expect(typeof row.biophysicalBoundariesTransgressed).toBe("number");
    expect(typeof row.gdpPerCapita).toBe("number");
  });

  it("keeps counts within the indicator bounds (0-11 social, 0-6 biophysical)", () => {
    for (const row of socialShortfallByCountry) {
      expect(row.socialThresholdsAchieved).toBeGreaterThanOrEqual(0);
      expect(row.socialThresholdsAchieved).toBeLessThanOrEqual(11);
      expect(row.biophysicalBoundariesTransgressed).toBeGreaterThanOrEqual(0);
      expect(row.biophysicalBoundariesTransgressed).toBeLessThanOrEqual(6);
    }
  });

  it("shows no country with a high social score and zero boundaries transgressed", () => {
    const utopian = socialShortfallByCountry.find(
      (row) =>
        row.socialThresholdsAchieved >= 8 &&
        row.biophysicalBoundariesTransgressed === 0,
    );
    expect(utopian).toBeUndefined();
  });

  it("assigns a real region to every row", () => {
    const regions = new Set(socialShortfallByCountry.map((r) => r.region));
    expect(regions).toEqual(
      new Set([
        "Europe",
        "North America",
        "South America",
        "Asia",
        "Africa",
        "Oceania",
      ]),
    );
  });
});

describe("eurogreenFranceScenarios", () => {
  it("has 3 scenarios across 37 years each (2014-2050)", () => {
    expect(eurogreenFranceScenarios).toHaveLength(111);
  });

  it("parses numeric fields as numbers", () => {
    const row = eurogreenFranceScenarios[0];
    expect(typeof row.year).toBe("number");
    expect(typeof row.gdpGrowthRate).toBe("number");
    expect(typeof row.unemploymentRate).toBe("number");
    expect(typeof row.co2PctOf1990).toBe("number");
    expect(typeof row.giniCoefficient).toBe("number");
  });

  it("includes exactly Baseline, Green Growth, and Degrowth scenarios", () => {
    const scenarios = new Set(eurogreenFranceScenarios.map((r) => r.scenario));
    expect(scenarios).toEqual(
      new Set(["Baseline", "Green Growth", "Degrowth"]),
    );
  });

  it("shows degrowth producing negative GDP growth by 2050, unlike baseline", () => {
    const degrowth2050 = eurogreenFranceScenarios.find(
      (r) => r.scenario === "Degrowth" && r.year === 2050,
    );
    const baseline2050 = eurogreenFranceScenarios.find(
      (r) => r.scenario === "Baseline" && r.year === 2050,
    );
    expect(degrowth2050?.gdpGrowthRate).toBeLessThan(0);
    expect(baseline2050?.gdpGrowthRate).toBeGreaterThan(0);
  });
});
