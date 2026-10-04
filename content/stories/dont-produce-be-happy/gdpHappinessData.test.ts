import { describe, expect, it } from "vitest";
import { gdpHappinessByCountryYear } from "./gdpHappinessData";

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
