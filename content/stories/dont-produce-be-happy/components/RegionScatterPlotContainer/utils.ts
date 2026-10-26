import { darkenHex } from "@/utils/colorHelpers";
import { formatCurrency } from "@/utils/formatHelpers";
import { LIFE_LADDER_LABEL } from "../../constants";
import type { GdpHappinessRow, HealthOutcomeByYear } from "../../data/csvData";
import { REGION_COLORS, TRACKED_COUNTRY } from "../../data/data";

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
      ariaLabel: `${row.country}, GDP per capita ${formatCurrency(row.gdpPerCapita)}, Life Ladder ${lifeLadderText}`,
      tooltipBody: [gdpText, `${LIFE_LADDER_LABEL}: ${lifeLadderText}`],
    };
  });
}

export function deriveHealthScatterData(countries: HealthOutcomeByYear[]) {
  return countries.map((country) => {
    const fill = REGION_COLORS[country.region];
    const isTracked = country.country === TRACKED_COUNTRY;
    const healthSpendingText = `${formatCurrency(country.healthSpendingPerCapita)} per capita`;
    const lifeExpectancyText = `${country.lifeExpectancy.toFixed(1)} years`;
    return {
      cx: country.healthSpendingPerCapita,
      cy: country.lifeExpectancy,
      radius: DOT_RADIUS,
      fill,
      stroke: darkenHex(fill, STROKE_DARKEN_AMOUNT),
      strokeWidth: 1,
      opacity: isTracked ? 1 : DIMMED_OPACITY,
      label: country.country,
      key: country.country,
      ariaLabel: `${country.country}, life expectancy ${lifeExpectancyText}, health spending ${healthSpendingText}`,
      tooltipBody: [healthSpendingText, lifeExpectancyText],
    };
  });
}
