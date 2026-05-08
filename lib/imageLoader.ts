import type { ImageLoaderProps } from "next/image";

const GENERATED_WIDTHS = [640, 828, 1080, 1200, 1920];

export default function loader({ src, width }: ImageLoaderProps): string {
  // Pass through external URLs and non-raster formats (SVG, etc.)
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    !/\.(jpe?g|png)$/i.test(src)
  ) {
    return src;
  }

  // Pick the next size up (or the largest if all are smaller)
  const chosen =
    GENERATED_WIDTHS.find((w) => w >= width) ??
    GENERATED_WIDTHS[GENERATED_WIDTHS.length - 1];

  // src is like "/images/featured_images/foo.jpg" or "/images/foo.jpg"
  // Strip the leading /images/ prefix, swap extension to .webp
  const relative = `${src.replace(/^\/images\//, "").replace(/\.[^.]+$/, "")}.webp`;

  return `/images/_optimized/${chosen}/${relative}`;
}
