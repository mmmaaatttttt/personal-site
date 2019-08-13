import { format } from "d3";

const percent = format(".1%");
const comma = format(",.0f");

// format data as an array of objects with title / body keys
// for use with a tooltip.
function generateTooltipData({ id, title, wordCounts }) {
  let totalWC = 0;
  for (let speaker in wordCounts) {
    totalWC += wordCounts[speaker];
  }
  return {
    title,
    body: [
      `Episode: ${id}`,
      ...Object.keys(wordCounts).map(
        speaker =>
          `${speaker}: ${comma(wordCounts[speaker])} words (${percent(
            wordCounts[speaker] / totalWC
          )})`
      )
    ]
  };
}

export { generateTooltipData };
