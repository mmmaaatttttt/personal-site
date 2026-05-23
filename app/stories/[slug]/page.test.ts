import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({ default: () => null }));
vi.mock("next/navigation", () => ({ notFound: vi.fn() }));
vi.mock("@/components/layout/MainLayout", () => ({ default: () => null }));
vi.mock("@/components/layout/StoryCard", () => ({ default: () => null }));
vi.mock("@/components/icons/BlueskyIcon", () => ({ default: () => null }));
vi.mock("@/utils/content", () => ({
  getAllArticles: vi.fn().mockReturnValue([]),
  getArticle: vi.fn(),
  getArticleSlugs: vi.fn().mockReturnValue([]),
  jaccardDistance: vi.fn().mockReturnValue(1),
}));

import { getArticle } from "@/utils/content";
import { generateMetadata } from "./page";

const mockFrontmatter = {
  title: "Test Story",
  caption: "A test caption",
  featured_image: "../../images/featured_images/test.jpg",
  date: "2024-01-01",
  tags: ["math"],
  featured_image_caption: "Photo credit: someone",
};

describe("generateMetadata", () => {
  it("includes the story featured image in openGraph and twitter metadata", async () => {
    vi.mocked(getArticle).mockReturnValue({
      frontmatter: mockFrontmatter,
      slug: "test-story",
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "test-story" }),
    });

    expect(metadata.openGraph?.images).toEqual([
      { url: "/images/featured_images/test.jpg" },
    ]);
    expect(metadata.twitter?.images).toEqual([
      "/images/featured_images/test.jpg",
    ]);
  });

  it("returns a fallback title when the story is not found", async () => {
    vi.mocked(getArticle).mockImplementation(() => {
      throw new Error("Not found");
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "nonexistent" }),
    });

    expect(metadata.title).toBe("Article Not Found");
  });
});
