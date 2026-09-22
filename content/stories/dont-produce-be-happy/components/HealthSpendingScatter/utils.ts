import { darkenHex } from "@/utils/colorHelpers";
import COLORS from "@/utils/styles";
import type { HealthOutcomeByYear, Region } from "../../healthSpendingData";

const DOT_RADIUS = 8;
const STROKE_DARKEN_AMOUNT = 0.3;
const DIMMED_OPACITY = 0.4;

const REGION_COLORS: Record<Region, string> = {
  "North America": COLORS.ORANGE,
  "South America": COLORS.MAROON,
  Africa: COLORS.PURPLE,
  Europe: COLORS.DARK_BLUE,
  Asia: COLORS.GREEN,
  Oceania: COLORS.BLUE,
};

export function deriveHealthScatterData(countries: HealthOutcomeByYear[]) {
  return countries.map((country) => {
    const fill = REGION_COLORS[country.region];
    const isUnitedStates = country.country === "United States";
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
    };
  });
}
