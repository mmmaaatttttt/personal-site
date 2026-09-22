import { describe, expect, it } from "vitest";
import type { HealthOutcomeByYear } from "../../healthSpendingData";
import { deriveHealthScatterData } from "./utils";

const countries: HealthOutcomeByYear[] = [
  {
    country: "United States",
    region: "North America",
    year: 2023,
    healthSpendingPerCapita: 13473.19,
    lifeExpectancy: 79.76,
  },
  {
    country: "Germany",
    region: "Europe",
    year: 2023,
    healthSpendingPerCapita: 6394.62,
    lifeExpectancy: 81.86,
  },
  {
    country: "Kenya",
    region: "Africa",
    year: 2023,
    healthSpendingPerCapita: 84.96,
    lifeExpectancy: 64.19,
  },
];

describe("deriveHealthScatterData", () => {
  it("maps health spending and life expectancy to x/y coordinates", () => {
    const [point] = deriveHealthScatterData(countries);
    expect(point.cx).toBe(13473.19);
    expect(point.cy).toBe(79.76);
    expect(point.key).toBe("United States");
    expect(point.label).toBe("United States");
  });

  it("colors points by region rather than income tier", () => {
    const [us, germany, kenya] = deriveHealthScatterData(countries);
    expect(us.fill).not.toBe(germany.fill);
    expect(germany.fill).not.toBe(kenya.fill);
  });

  it("gives every point the same radius and stroke width regardless of GDP", () => {
    const [us, germany, kenya] = deriveHealthScatterData(countries);
    expect(us.radius).toBe(germany.radius);
    expect(germany.radius).toBe(kenya.radius);
    expect(us.strokeWidth).toBe(germany.strokeWidth);
  });

  it("flags the United States and only the United States", () => {
    const [us, germany, kenya] = deriveHealthScatterData(countries);
    expect(us.isUnitedStates).toBe(true);
    expect(germany.isUnitedStates).toBe(false);
    expect(kenya.isUnitedStates).toBe(false);
  });

  it("keeps the United States at full opacity and dims everyone else", () => {
    const [us, germany, kenya] = deriveHealthScatterData(countries);
    expect(us.opacity).toBe(1);
    expect(germany.opacity).toBeLessThan(1);
    expect(germany.opacity).toBe(kenya.opacity);
  });
});
