import { format } from "d3";
import COLORS from "@/utils/styles";

const percent = format(".1%");
const comma = format(",.0f");

// format data as an array of objects with title / body keys
// for use with a tooltip.
function generateTooltipData({ meta: { id, title }, counts }: any) {
  let total = 0;
  for (const speaker in counts) {
    total += counts[speaker];
  }
  return {
    title,
    body: [
      `Episode: ${id}`,
      ...Object.keys(counts).map(
        (speaker) =>
          `${speaker}: ${comma(counts[speaker])} (${percent(
            counts[speaker] / total,
          )} of total)`,
      ),
    ],
  };
}

const defaultSentimentOptions = [
  [
    { value: "0", label: "Extremely Negative (-1 to -0.5)" },
    { value: "1", label: "Negative (-0.5 to -0.05)" },
    { value: "2", label: "Neutral (-0.05 to 0.05)" },
    { value: "3", label: "Positive (0.05 to 0.5)" },
    { value: "4", label: "Extremely Positive (0.5 to 1)" },
  ],
];

const colorMap = {
  Chris: COLORS.DARK_BLUE,
  Caller: COLORS.ORANGE,
};

interface Feature {
  caption: string;
  width: number;
}

const baFeatures: Feature[] = [
  { caption: 'First word is "wow"', width: 12.9 },
  { caption: 'Contains "wonder"', width: 10.7 },
  { caption: 'Most common word is "your"', width: 10.1 },
  { caption: 'First word is "what\'s"', width: 9.5 },
  { caption: 'Contains "must"', width: 9.2 },
  { caption: 'Most common word is "wow"', width: 8.8 },
  { caption: 'Most common word is "what\'s"', width: 8.1 },
  { caption: 'Contains "breaking"', width: 8.1 },
  { caption: 'Contains "incredible"', width: 8.1 },
  { caption: 'First word is "you\'re"', width: 7.6 },
  { caption: 'Contains "sounds"', width: 6.9 },
  { caption: 'Contains "wow"', width: 6.5 },
  { caption: 'Contains "honestly"', width: -6.3 },
  { caption: 'Contains "company"', width: -6.5 },
  { caption: 'Contains "completely"', width: -7.2 },
  { caption: 'First word is "my"', width: -7.6 },
  { caption: 'Contains "doctor"', width: -7.9 },
  { caption: 'Contains "she\'s"', width: -7.9 },
  { caption: 'Most common word is "my"', width: -14.0 },
  { caption: 'Contains "definitely"', width: -14.1 },
];

const horizontalBarData = baFeatures.map((d) => ({
  ...d,
  fill: colorMap[d.width > 0 ? "Chris" : "Caller"],
}));

export {
  colorMap,
  defaultSentimentOptions,
  generateTooltipData,
  horizontalBarData,
};
