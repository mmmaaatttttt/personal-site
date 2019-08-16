import { format } from "d3";

const percent = format(".1%");
const comma = format(",.0f");

// format data as an array of objects with title / body keys
// for use with a tooltip.
function generateTooltipData({ meta: { id, title }, counts }) {
  let totalWC = 0;
  for (let speaker in counts) {
    totalWC += counts[speaker];
  }
  return {
    title,
    body: [
      `Episode: ${id}`,
      ...Object.keys(counts).map(
        speaker =>
          `${speaker}: ${comma(counts[speaker])} words (${percent(
            counts[speaker] / totalWC
          )})`
      )
    ]
  };
}

export { generateTooltipData };
