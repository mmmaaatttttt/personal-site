import type { SliderInitialData } from "@/hooks/useSliders";
import COLORS from "@/utils/styles";

export const MAX_BONUS_SPINS = 150;

export const WIDTH = 700;
export const HEIGHT = 400;
export const GRAPH_PADDING = { top: 20, bottom: 60, left: 70, right: 20 };
export const DOT_RADIUS = 3;
export const X_TICK_COUNT = 10;
export const Y_TICK_COUNT = 8;

export const OPTIMAL_COLOR = COLORS.GREEN;
export const BOUNDED_COLOR = COLORS.PURPLE;

export const OPTIMAL_LABEL = "Optimal";
export const BOUNDED_LABEL = "Suboptimal";

export const SLIDER_CONFIG: SliderInitialData[] = [
  {
    initialValue: 1,
    min: 0,
    max: 1,
    step: 0.05,
    title: (val: number) => `Optimality measurement: ${val.toFixed(2)}`,
    color: BOUNDED_COLOR,
  },
];
