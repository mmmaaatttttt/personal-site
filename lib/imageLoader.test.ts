import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/imageWidths.json", () => ({
  default: {
    "/images/photo.jpg": 1920,
    "/images/photo.jpeg": 1920,
    "/images/photo.JPG": 1920,
    "/images/logo.png": 1920,
    "/images/matt.jpg": 1920,
    "/images/featured_images/four_weddings.jpg": 1920,
    "/images/a/b/c.png": 1920,
    "/images/small.jpg": 640,
  },
}));

import loader from "./imageLoader";

describe("imageLoader", () => {
  describe("passthrough cases", () => {
    it("returns http URLs unchanged", () => {
      expect(
        loader({
          src: "http://example.com/photo.jpg",
          width: 800,
          quality: 75,
        }),
      ).toBe("http://example.com/photo.jpg");
    });

    it("returns https URLs unchanged", () => {
      expect(
        loader({
          src: "https://cdn.example.com/photo.png",
          width: 800,
          quality: 75,
        }),
      ).toBe("https://cdn.example.com/photo.png");
    });

    it("returns SVG paths unchanged", () => {
      expect(loader({ src: "/images/icon.svg", width: 100, quality: 75 })).toBe(
        "/images/icon.svg",
      );
    });

    it("returns other non-raster paths unchanged", () => {
      expect(
        loader({ src: "/images/animation.gif", width: 400, quality: 75 }),
      ).toBe("/images/animation.gif");
    });

    it("returns /_next/static/media paths unchanged (static next/image imports)", () => {
      expect(
        loader({
          src: "/_next/static/media/matt.abc12345.jpg",
          width: 500,
          quality: 75,
        }),
      ).toBe("/_next/static/media/matt.abc12345.jpg");
    });
  });

  describe("width selection", () => {
    it("picks the exact match when requested width is in the generated set", () => {
      expect(
        loader({ src: "/images/photo.jpg", width: 828, quality: 75 }),
      ).toBe("/images/_optimized/828/photo.webp");
    });

    it("picks the next size up when requested width falls between generated widths", () => {
      expect(
        loader({ src: "/images/photo.jpg", width: 900, quality: 75 }),
      ).toBe("/images/_optimized/1080/photo.webp");
    });

    it("picks the smallest generated width for a very small request", () => {
      expect(
        loader({ src: "/images/photo.jpg", width: 100, quality: 75 }),
      ).toBe("/images/_optimized/640/photo.webp");
    });

    it("picks the largest generated width when request exceeds all generated sizes", () => {
      expect(
        loader({ src: "/images/photo.jpg", width: 2560, quality: 75 }),
      ).toBe("/images/_optimized/1920/photo.webp");
    });

    it("picks the largest generated width when request exactly equals the largest", () => {
      expect(
        loader({ src: "/images/photo.jpg", width: 1920, quality: 75 }),
      ).toBe("/images/_optimized/1920/photo.webp");
    });
  });

  describe("width selection with imageWidths manifest", () => {
    it("caps to the largest generated width when the manifest limits available widths", () => {
      // /images/small.jpg has maxGenerated=640 in the mock; width=1920 must be capped to 640
      expect(
        loader({ src: "/images/small.jpg", width: 1920, quality: 75 }),
      ).toBe("/images/_optimized/640/small.webp");
    });

    it("falls back to the largest available width when request exceeds the capped maximum", () => {
      expect(
        loader({ src: "/images/photo.jpg", width: 2560, quality: 75 }),
      ).toBe("/images/_optimized/1920/photo.webp");
    });

    it("returns src unchanged for images not in the manifest", () => {
      expect(
        loader({ src: "/images/unknown.jpg", width: 800, quality: 75 }),
      ).toBe("/images/unknown.jpg");
    });
  });

  describe("path construction", () => {
    it("converts .jpg to .webp", () => {
      expect(loader({ src: "/images/matt.jpg", width: 640, quality: 75 })).toBe(
        "/images/_optimized/640/matt.webp",
      );
    });

    it("converts .jpeg to .webp", () => {
      expect(
        loader({ src: "/images/photo.jpeg", width: 640, quality: 75 }),
      ).toBe("/images/_optimized/640/photo.webp");
    });

    it("converts .png to .webp", () => {
      expect(loader({ src: "/images/logo.png", width: 828, quality: 75 })).toBe(
        "/images/_optimized/828/logo.webp",
      );
    });

    it("handles uppercase extensions", () => {
      expect(
        loader({ src: "/images/photo.JPG", width: 640, quality: 75 }),
      ).toBe("/images/_optimized/640/photo.webp");
    });

    it("preserves subdirectory structure", () => {
      expect(
        loader({
          src: "/images/featured_images/four_weddings.jpg",
          width: 1080,
          quality: 75,
        }),
      ).toBe("/images/_optimized/1080/featured_images/four_weddings.webp");
    });

    it("strips only the leading /images/ prefix, not deeper path segments", () => {
      expect(
        loader({ src: "/images/a/b/c.png", width: 640, quality: 75 }),
      ).toBe("/images/_optimized/640/a/b/c.webp");
    });
  });
});
