import { extent } from "d3-array";
import { scaleSqrt } from "d3-scale";
import { darkenHex } from "@/utils/colorHelpers";
import { formatCurrency } from "@/utils/formatHelpers";
import type { SocialShortfallRow } from "../../data/csvData";
import { REGION_COLORS } from "../../data/data";

const MIN_RADIUS = 5;
const MAX_RADIUS = 20;
const STROKE_DARKEN_AMOUNT = 0.3;
const JITTER_STEP = 0.12;

export function deriveScatterData(rows: SocialShortfallRow[]) {
  const [minGdp, maxGdp] = extent(rows, (row) => row.gdpPerCapita) as [
    number,
    number,
  ];
  const radiusScale = scaleSqrt()
    .domain([minGdp, maxGdp])
    .range([MIN_RADIUS, MAX_RADIUS]);

  const groups = new Map<string, SocialShortfallRow[]>();
  for (const row of rows) {
    const key = `${row.socialThresholdsAchieved}:${row.biophysicalBoundariesTransgressed}`;
    const group = groups.get(key);
    if (group) {
      group.push(row);
    } else {
      groups.set(key, [row]);
    }
  }

  const points = Array.from(groups.values()).flatMap((group) => {
    const sorted = [...group].sort((a, b) =>
      a.country.localeCompare(b.country),
    );
    const center = (sorted.length - 1) / 2;
    return sorted.map((row, i) => {
      const fill = REGION_COLORS[row.region];
      const gdpText = `${formatCurrency(row.gdpPerCapita)} per capita`;
      const socialText = `${row.socialThresholdsAchieved} of 11 social thresholds achieved`;
      const biophysicalText = `${row.biophysicalBoundariesTransgressed} of 6 biophysical boundaries transgressed`;
      return {
        cx: row.biophysicalBoundariesTransgressed + (i - center) * JITTER_STEP,
        cy: row.socialThresholdsAchieved,
        radius: radiusScale(row.gdpPerCapita),
        fill,
        stroke: darkenHex(fill, STROKE_DARKEN_AMOUNT),
        label: row.country,
        key: row.country,
        ariaLabel: `${row.country}, ${socialText}, ${biophysicalText}, ${gdpText}`,
        tooltipBody: [socialText, biophysicalText, gdpText],
      };
    });
  });

  return points.sort((a, b) => b.radius - a.radius);
}
