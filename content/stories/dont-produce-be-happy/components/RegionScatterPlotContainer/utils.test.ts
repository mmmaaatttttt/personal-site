import { describe, expect, it } from "vitest";
import type { GdpHappinessRow, HealthOutcomeByYear } from "../../csvData";
import {
  deriveGdpHappinessScatterData,
  deriveHealthScatterData,
} from "./utils";

const gdpHappinessRows: GdpHappinessRow[] = [
  {
    country: "United States",
    region: "North America",
    year: 2025,
    gdpPerCapita: 90026.52,
    lifeLadder: 6.816,
  },
  {
    country: "Germany",
    region: "Europe",
    year: 2025,
    gdpPerCapita: 56000,
    lifeLadder: 6.9,
  },
  {
    country: "Kenya",
    region: "Africa",
    year: 2025,
    gdpPerCapita: 2200,
    lifeLadder: 4.5,
  },
];

const healthCountries: HealthOutcomeByYear[] = [
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

describe("deriveGdpHappinessScatterData", () => {
  it("maps GDP and Life Ladder to x/y coordinates", () => {
    const [point] = deriveGdpHappinessScatterData(gdpHappinessRows);
    expect(point.cx).toBe(90026.52);
    expect(point.cy).toBe(6.816);
    expect(point.key).toBe("United States");
    expect(point.label).toBe("United States");
  });

  it("colors points by region", () => {
    const [us, germany, kenya] =
      deriveGdpHappinessScatterData(gdpHappinessRows);
    expect(us.fill).not.toBe(germany.fill);
    expect(germany.fill).not.toBe(kenya.fill);
  });

  it("gives every point the same radius and stroke width", () => {
    const [us, germany, kenya] =
      deriveGdpHappinessScatterData(gdpHappinessRows);
    expect(us.radius).toBe(germany.radius);
    expect(germany.radius).toBe(kenya.radius);
    expect(us.strokeWidth).toBe(germany.strokeWidth);
  });

  it("flags the United States and only the United States", () => {
    const [us, germany, kenya] =
      deriveGdpHappinessScatterData(gdpHappinessRows);
    expect(us.isTracked).toBe(true);
    expect(germany.isTracked).toBe(false);
    expect(kenya.isTracked).toBe(false);
  });

  it("keeps the United States at full opacity and dims everyone else", () => {
    const [us, germany, kenya] =
      deriveGdpHappinessScatterData(gdpHappinessRows);
    expect(us.opacity).toBe(1);
    expect(germany.opacity).toBeLessThan(1);
    expect(germany.opacity).toBe(kenya.opacity);
  });

  it("builds an aria-label and tooltip body from the country's GDP and Life Ladder score", () => {
    const [us] = deriveGdpHappinessScatterData(gdpHappinessRows);
    expect(us.ariaLabel).toBe(
      "United States, GDP per capita $90,027 per capita, Life Ladder 6.82",
    );
    expect(us.tooltipBody).toEqual(["$90,027 per capita", "6.82"]);
  });
});

describe("deriveHealthScatterData", () => {
  it("maps health spending and life expectancy to x/y coordinates", () => {
    const [point] = deriveHealthScatterData(healthCountries);
    expect(point.cx).toBe(13473.19);
    expect(point.cy).toBe(79.76);
    expect(point.key).toBe("United States");
    expect(point.label).toBe("United States");
  });

  it("colors points by region rather than income tier", () => {
    const [us, germany, kenya] = deriveHealthScatterData(healthCountries);
    expect(us.fill).not.toBe(germany.fill);
    expect(germany.fill).not.toBe(kenya.fill);
  });

  it("gives every point the same radius and stroke width regardless of GDP", () => {
    const [us, germany, kenya] = deriveHealthScatterData(healthCountries);
    expect(us.radius).toBe(germany.radius);
    expect(germany.radius).toBe(kenya.radius);
    expect(us.strokeWidth).toBe(germany.strokeWidth);
  });

  it("flags the United States and only the United States", () => {
    const [us, germany, kenya] = deriveHealthScatterData(healthCountries);
    expect(us.isUnitedStates).toBe(true);
    expect(germany.isUnitedStates).toBe(false);
    expect(kenya.isUnitedStates).toBe(false);
  });

  it("keeps the United States at full opacity and dims everyone else", () => {
    const [us, germany, kenya] = deriveHealthScatterData(healthCountries);
    expect(us.opacity).toBe(1);
    expect(germany.opacity).toBeLessThan(1);
    expect(germany.opacity).toBe(kenya.opacity);
  });

  it("builds an aria-label and tooltip body from the country's spending and life expectancy", () => {
    const [us] = deriveHealthScatterData(healthCountries);
    expect(us.ariaLabel).toBe(
      "United States, life expectancy 79.8 years, health spending $13,473 per capita",
    );
    expect(us.tooltipBody).toEqual(["$13,473 per capita", "79.8 years"]);
  });
});
