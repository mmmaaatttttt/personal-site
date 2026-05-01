import { scaleLinear } from "d3-scale";
import COLORS from "@/utils/styles";

export const PRIMES = [3, 5, 7];
export const PRIME_OPTIONS = PRIMES.map((p) => ({
  value: String(p),
  label: `Selected prime: ${p}`,
}));

export const LEVEL_COLORS = [COLORS.BLACK, COLORS.BLUE, COLORS.ORANGE];

export const WIDTH = 600;
export const HEIGHT = 600;
const PADDING = 30;

export const xScale = scaleLinear()
  .domain([-1, 1])
  .range([PADDING, WIDTH - PADDING]);

export const yScale = scaleLinear()
  .domain([-1, 1])
  .range([HEIGHT - PADDING, PADDING]);
