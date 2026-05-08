import type { ImageLoaderProps } from "next/image";
import imageWidths from "@/lib/imageWidths.json";

const GENERATED_WIDTHS = [640, 828, 1080, 1200, 1920];

export default function loader({ src, width }: ImageLoaderProps): string {
  // Pass through: external URLs, non-raster formats, and anything not under /images/
  // (static next/image imports produce /_next/static/media/... paths — leave those alone)
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    !src.startsWith("/images/") ||
    !/\.(jpe?g|png)$/i.test(src)
  ) {
    return src;
  }

  // Only pick widths that were actually generated for this source image
  const maxGenerated = (imageWidths as Record<string, number>)[src];
  const available =
    maxGenerated !== undefined
      ? GENERATED_WIDTHS.filter((w) => w <= maxGenerated)
      : GENERATED_WIDTHS;

  const chosen =
    available.find((w) => w >= width) ?? available[available.length - 1];

  // src is like "/images/featured_images/foo.jpg" or "/images/foo.jpg"
  const relative = `${src.replace(/^\/images\//, "").replace(/\.[^.]+$/, "")}.webp`;

  return `/images/_optimized/${chosen}/${relative}`;
}
