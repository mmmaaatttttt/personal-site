/**
 * Inverts the slider parameter `r = 1/(1+T)` back into the softmax
 * temperature `T`. `r=1` (fully rational) maps to `T=0`; `r=0` (fully
 * random) maps to `T=Infinity`, handled explicitly to avoid a division by
 * zero at the slider's minimum.
 */
export function temperatureFromSlider(r: number): number {
  if (r <= 0) return Infinity;
  if (r >= 1) return 0;
  return (1 - r) / r;
}
