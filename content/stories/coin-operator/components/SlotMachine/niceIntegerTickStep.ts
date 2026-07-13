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
