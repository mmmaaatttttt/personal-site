import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadMeta } from "./loadMeta";

const STORIES_DIR = path.join(process.cwd(), "content", "stories");
const storySlugs = fs
  .readdirSync(STORIES_DIR, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

describe("loadMeta", () => {
  it.each(storySlugs)("loads frontmatter from %s's real meta", async (slug) => {
    const meta = await loadMeta(slug);
    expect(meta.title).toBeTruthy();
    expect(meta.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Array.isArray(meta.tags)).toBe(true);
    expect(meta.tags.length).toBeGreaterThan(0);
  });

  it("throws for a non-existent story", async () => {
    await expect(loadMeta("this-story-does-not-exist-xyz")).rejects.toThrow();
  });
});
