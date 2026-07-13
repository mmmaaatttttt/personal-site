import { tickStep } from "d3-array";

/**
 * Wraps d3's tickStep with a floor of 1. Both chart axes here are
 * integer-only (rounds played; whole-coin amounts), so a fractional step
 * would round multiple ticks to the same displayed integer.
 */
export function niceIntegerTickStep(
  min: number,
  max: number,
  count: number,
): number {
  return Math.max(1, tickStep(min, max, count));
}

/**
 * Integer tick values from min to max, inclusive, spaced by
 * niceIntegerTickStep. d3-axis's own tickValues(range(domain[0], domain[1] +
 * step, step)) can overshoot domain[1] by up to one step when the domain
 * span isn't an exact multiple of it — that overshoot tick renders (and
 * gets clipped) past the edge of the plotted area. This never overshoots.
 */
export function niceIntegerTickValues(
  min: number,
  max: number,
  count: number,
): number[] {
  const step = niceIntegerTickStep(min, max, count);
  const values: number[] = [];
  for (let v = min; v <= max; v += step) {
    values.push(v);
  }
  return values;
}
