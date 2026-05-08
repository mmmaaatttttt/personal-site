import { describe, expect, it } from "vitest";
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
