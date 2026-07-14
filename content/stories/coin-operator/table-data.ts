import { PROBABILITY_MAP, SlotValue, SYMBOL_EMOJI, SYMBOL_NAME } from "./data";
import {
  calculatePayout,
  calculateProbability,
  classifyPayout,
  enumerateSlotResults,
} from "./math";

const probabilityData: [symbol: string, name: string, probability: number][] = (
  Object.values(SlotValue) as SlotValue[]
).map((symbol) => [
  SYMBOL_EMOJI[symbol],
  SYMBOL_NAME[symbol],
  PROBABILITY_MAP[symbol],
]);

export const probabilityTable: string[][] = [
  ["Symbol", "Symbol Name", "Probability"],
  ...probabilityData
    .sort((row1, row2) => row2[2] - row1[2])
    .map((row) => [row[0], row[1], `${(row[2] * 100).toFixed(1)}%`]),
];

/**
 * Fixed decimal places show "0.000%" for every sufficiently rare combo (e.g.
 * four clovers, which is rare enough to need 8+ decimal places) — format
 * with enough decimals to show `sigFigs` significant digits instead.
 */
function formatSignificantPercentage(probability: number, sigFigs = 3): string {
  const percentage = probability * 100;
  if (percentage === 0) return "0%";
  const magnitude = Math.floor(Math.log10(Math.abs(percentage)));
  const decimals = Math.max(0, sigFigs - 1 - magnitude);
  return `${percentage.toFixed(decimals)}%`;
}

interface PayoutGroup {
  classification: string;
  payout: number;
  probability: number;
}

// Many distinct symbol combinations share the same classification (e.g.
// three coins plus any one of several irrelevant fourth symbols) — group by
// classification, not raw payout, so unrelated mechanics that happen to
// total the same payout don't get merged into one row.
const payoutGroupsByClassification = new Map<string, PayoutGroup>();

for (const slotResult of enumerateSlotResults()) {
  const classification = classifyPayout(slotResult);
  if (classification === null) continue;

  const probability = calculateProbability(slotResult);
  const group = payoutGroupsByClassification.get(classification);

  if (group) {
    group.probability += probability;
  } else {
    payoutGroupsByClassification.set(classification, {
      classification,
      payout: calculatePayout(slotResult),
      probability,
    });
  }
}

const payoutData: [symbols: string, payout: number, probability: number][] =
  Array.from(payoutGroupsByClassification.values()).map((group) => [
    group.classification,
    group.payout,
    group.probability,
  ]);

export const payoutTable: string[][] = [
  ["Winning Combination", "Payout", "Probability"],
  ...payoutData
    .sort((row1, row2) => row1[1] - row2[1])
    .map((row) => [row[0], `${row[1]}`, formatSignificantPercentage(row[2])]),
];
