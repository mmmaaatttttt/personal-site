import { describe, expect, it } from "vitest";
import { loadMeta } from "./loadMeta";

describe("loadMeta", () => {
  it("loads frontmatter from a real story meta", async () => {
    const meta = await loadMeta("dailemma");
    expect(meta.title).toBeTruthy();
    expect(meta.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Array.isArray(meta.tags)).toBe(true);
    expect(meta.tags.length).toBeGreaterThan(0);
  });

  it("throws for a non-existent story", async () => {
    await expect(loadMeta("this-story-does-not-exist-xyz")).rejects.toThrow();
  });
});
