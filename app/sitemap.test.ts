import { describe, expect, it, vi } from "vitest";

vi.mock("@/utils/content", () => ({
  getAllArticles: vi.fn().mockResolvedValue([
    {
      slug: "test-story",
      date: "March 2024",
      rawDate: "2024-03-15",
      title: "Test Story",
      caption: "A test",
      featured_image: "/img.jpg",
      tags: [],
      timeToRead: 5,
    },
  ]),
}));

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes static pages with correct priorities", async () => {
    const result = await sitemap();
    expect(result[0]).toEqual(
      expect.objectContaining({ url: "https://mattlane.us", priority: 1 }),
    );
    expect(result[1]).toEqual(
      expect.objectContaining({
        url: "https://mattlane.us/stories",
        priority: 0.9,
      }),
    );
    expect(result[2]).toEqual(
      expect.objectContaining({
        url: "https://mattlane.us/about",
        priority: 0.5,
      }),
    );
  });

  it("includes all articles with correct fields", async () => {
    const result = await sitemap();
    const storyEntry = result.find((e) => e.url.includes("test-story"));
    expect(storyEntry).toBeDefined();
    expect(storyEntry?.url).toBe("https://mattlane.us/stories/test-story");
    expect(storyEntry?.changeFrequency).toBe("monthly");
    expect(storyEntry?.priority).toBe(0.8);
    expect(storyEntry?.lastModified).toEqual(new Date("2024-03-15"));
  });
});
