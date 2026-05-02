import { THEME_OPACITY } from "./constants";

/**
 * Blends a hex color with a white background at the specified opacity
 * to create an opaque version of the "light" theme color.
 */
export function getOpaqueLightColor(color: string): string {
  if (!color || !color.startsWith("#") || color.length !== 7) return color;

  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const alpha = THEME_OPACITY;
  const blend = (c: number) => Math.round(c * alpha + 255 * (1 - alpha));

  return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
}
