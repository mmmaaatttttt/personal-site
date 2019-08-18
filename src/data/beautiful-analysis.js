import { format } from "d3";
import COLORS from "utils/styles";

const percent = format(".1%");
const comma = format(",.0f");

// format data as an array of objects with title / body keys
// for use with a tooltip.
function generateTooltipData({ meta: { id, title }, counts }) {
  let total = 0;
  for (let speaker in counts) {
    total += counts[speaker];
  }
  return {
    title,
    body: [
      `Episode: ${id}`,
      ...Object.keys(counts).map(
        speaker =>
          `${speaker}: ${comma(counts[speaker])} (${percent(
            counts[speaker] / total
          )} of total)`
      )
    ]
  };
}

const defaultSentimentOptions = [
  [
    {
      value: 0,
      label: "Extremely Negative (-1 to -0.5)"
    },
    {
      value: 1,
      label: "Negative (-0.5 to -0.05)"
    },
    {
      value: 2,
      label: "Neutral (-0.05 to 0.05)"
    },
    {
      value: 3,
      label: "Positive (0.05 to 0.5)"
    },
    {
      value: 4,
      label: "Extremely Positive (0.5 to 1)"
    }
  ]
];

const colorMap = {
  Chris: COLORS.DARK_BLUE,
  Caller: COLORS.ORANGE
};

export { colorMap, defaultSentimentOptions, generateTooltipData };
