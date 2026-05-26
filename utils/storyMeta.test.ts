import { describe, expect, it } from "vitest";
import { storyMeta } from "./storyMeta";

describe("storyMeta", () => {
  it("is non-empty", () => {
    expect(Object.keys(storyMeta).length).toBeGreaterThan(0);
  });

  it("each entry has the required ArticleFrontmatter fields", () => {
    for (const [slug, meta] of Object.entries(storyMeta)) {
      expect(meta.title, `${slug}.title`).toBeTruthy();
      expect(meta.date, `${slug}.date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(meta.caption, `${slug}.caption`).toBeTruthy();
      expect(Array.isArray(meta.tags), `${slug}.tags`).toBe(true);
      expect(meta.tags.length, `${slug} has at least one tag`).toBeGreaterThan(
        0,
      );
    }
  });
});
