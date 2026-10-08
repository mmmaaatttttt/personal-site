import { darkenHex } from "@/utils/colorHelpers";
import { formatCurrency } from "@/utils/formatHelpers";
import type { GdpHappinessRow, HealthOutcomeByYear } from "../../csvData";
import { REGION_COLORS, TRACKED_COUNTRY } from "../../data";

const DOT_RADIUS = 8;
const STROKE_DARKEN_AMOUNT = 0.3;
const DIMMED_OPACITY = 0.4;

export function deriveGdpHappinessScatterData(rows: GdpHappinessRow[]) {
  return rows.map((row) => {
    const fill = REGION_COLORS[row.region];
    const isTracked = row.country === TRACKED_COUNTRY;
    const gdpText = `${formatCurrency(row.gdpPerCapita)} per capita`;
    const lifeLadderText = row.lifeLadder.toFixed(2);
    return {
      cx: row.gdpPerCapita,
      cy: row.lifeLadder,
      radius: DOT_RADIUS,
      fill,
      stroke: darkenHex(fill, STROKE_DARKEN_AMOUNT),
      strokeWidth: 1,
      opacity: isTracked ? 1 : DIMMED_OPACITY,
      label: row.country,
      key: row.country,
      isTracked,
      ariaLabel: `${row.country}, GDP per capita ${gdpText}, Life Ladder ${lifeLadderText}`,
      tooltipBody: [gdpText, lifeLadderText],
    };
  });
}

export function deriveHealthScatterData(countries: HealthOutcomeByYear[]) {
  return countries.map((country) => {
    const fill = REGION_COLORS[country.region];
    const isUnitedStates = country.country === "United States";
    const healthSpendingText = `${formatCurrency(country.healthSpendingPerCapita)} per capita`;
    const lifeExpectancyText = `${country.lifeExpectancy.toFixed(1)} years`;
    return {
      cx: country.healthSpendingPerCapita,
      cy: country.lifeExpectancy,
      radius: DOT_RADIUS,
      fill,
      stroke: darkenHex(fill, STROKE_DARKEN_AMOUNT),
      strokeWidth: 1,
      opacity: isUnitedStates ? 1 : DIMMED_OPACITY,
      label: country.country,
      key: country.country,
      isUnitedStates,
      ariaLabel: `${country.country}, life expectancy ${lifeExpectancyText}, health spending ${healthSpendingText}`,
      tooltipBody: [healthSpendingText, lifeExpectancyText],
    };
  });
}
