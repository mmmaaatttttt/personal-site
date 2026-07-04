import type { SliderInitialData } from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import {
  DEFAULT_DEMAND_LOSS,
  DEFAULT_DIFFICULTY,
  DEFAULT_NUM_FIRMS,
  DEFAULT_SAVINGS,
  DEMAND_LOSS_KEY,
  DIFFICULTY_KEY,
  NUM_FIRMS_KEY,
  SAVINGS_KEY,
} from "./sliderStore";

export const N_MAX = 20;

export const BASE_SLIDER_CONFIG: SliderInitialData[] = [
  {
    min: 0,
    max: 1,
    initialValue: DEFAULT_SAVINGS,
    storageKey: SAVINGS_KEY,
    title: (val: number) =>
      `How much automation saves per task: ${Math.round(val * 100)}%`,
    color: COLORS.ORANGE,
  },
  {
    min: 0,
    max: 1,
    initialValue: DEFAULT_DEMAND_LOSS,
    storageKey: DEMAND_LOSS_KEY,
    title: (val: number) =>
      `Consumer spending lost per job cut: ${Math.round(val * 100)}%`,
    color: COLORS.BLUE,
  },
  {
    min: 0.2,
    max: 3,
    initialValue: DEFAULT_DIFFICULTY,
    storageKey: DIFFICULTY_KEY,
    title: (val: number) => `How hard it is to automate: ${val.toFixed(1)}`,
    color: COLORS.PURPLE,
  },
  {
    min: 1,
    max: N_MAX,
    step: 1,
    initialValue: DEFAULT_NUM_FIRMS,
    storageKey: NUM_FIRMS_KEY,
    title: (val: number) => `Number of competing firms: ${Math.round(val)}`,
    color: COLORS.DARK_GRAY,
  },
];
