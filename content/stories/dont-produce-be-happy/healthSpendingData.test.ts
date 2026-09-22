import { describe, expect, it } from "vitest";
import { healthOutcomesByYear } from "./healthSpendingData";

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
