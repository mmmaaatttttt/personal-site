import { hexToRgb } from "@/utils/colorHelpers";
import { THEME_OPACITY } from "./constants";

/**
 * Blends a hex color with a white background at the specified opacity
 * to create an opaque version of the "light" theme color.
 */
export function getOpaqueLightColor(color: string): string {
  if (!color?.startsWith("#") || color.length !== 7) return color;

  const [r, g, b] = hexToRgb(color);

  const alpha = THEME_OPACITY;
  const blend = (c: number) => Math.round(c * alpha + 255 * (1 - alpha));

  return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
}
