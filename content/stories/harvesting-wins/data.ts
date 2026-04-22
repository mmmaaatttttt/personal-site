import COLORS from "@/utils/styles";
import { camelCaseToTitle } from "@/utils/stringHelpers";
import type { OrchardDataPoint } from "./orchard-game";

export interface Strategy {
  name: string;
  fn: (fruitCounts: number[]) => number;
}

export const strategies: Strategy[] = [
  {
    name: "mostPlentiful",
    fn: (fruitCounts) => {
      const maxCount = Math.max(...fruitCounts);
      return fruitCounts.findIndex((c) => c === maxCount);
    },
  },
  {
    name: "leastPlentiful",
    fn: (fruitCounts) => {
      const minCount = Math.min(...fruitCounts.filter((c) => c > 0));
      return fruitCounts.findIndex((c) => c === minCount);
    },
  },
  {
    name: "random",
    fn: (fruitCounts) => {
      const validIndices: number[] = [];
      for (let i = 0; i < fruitCounts.length; i++) {
        if (fruitCounts[i] > 0) validIndices.push(i);
      }
      return validIndices[Math.floor(Math.random() * validIndices.length)];
    },
  },
  {
    name: "favoriteColor",
    fn: (fruitCounts) => fruitCounts.findIndex((c) => c > 0),
  },
];

export type { OrchardDataPoint } from "./orchard-game";

export interface SelectOption {
  value: string;
  label: string;
  accessor: (d: OrchardDataPoint) => number;
}

export const selectOptions: SelectOption[] = strategies
  .map((strategy) => ({
    value: strategy.name,
    label: `${camelCaseToTitle(strategy.name)} Strategy`,
    accessor: (d: OrchardDataPoint) => d.probs[strategy.name],
  }))
  .concat({
    value: "diff",
    label: "Largest difference between strategies",
    accessor: (d: OrchardDataPoint) => {
      const probs = Object.values(d.probs);
      return Math.max(...probs) - Math.min(...probs);
    },
  });

// Number of distinct color counts in the dataset (used as slider max)
// The JSON has colors 1–5, so SLIDER_MAX = 5
export const SLIDER_MAX = 5;

export const firstOrchardTable: string[][] = [
  ["Strategy", "Probability of Success"],
  ["Most Plentiful", "63.1%"],
  ["Least Plentiful", "55.5%"],
  ["Random", "59.7%"],
  ["Favorite Color", "58.3%"],
];

export const orchardGameTable: string[][] = [
  ["Strategy", "Probability of Success", "Change"],
  ["Most Plentiful", "68.4%", "+5.3"],
  ["Least Plentiful", "53.2%", "-2.3"],
  ["Random", "63.2%", "+3.5"],
  ["Favorite Color", "56.8%", "-1.5"],
];

export { default as orchardGameData } from "./orchard-game";

export const sliderData = [
  {
    min: 1,
    max: SLIDER_MAX,
    step: 1,
    initialValue: 4,
    title: (val: number) => `Number of Fruit Colors: ${val}`,
    color: COLORS.DARK_GRAY,
    tickCount: SLIDER_MAX,
  },
  {
    min: 1,
    max: SLIDER_MAX,
    step: 1,
    initialValue: 1,
    title: (val: number) =>
      `Number of Fruits You Can Remove on the Wild Card: ${val}`,
    color: COLORS.DARK_GRAY,
    tickCount: SLIDER_MAX,
  },
];
