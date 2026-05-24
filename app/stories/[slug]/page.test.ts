import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({ default: () => null }));
vi.mock("next/navigation", () => ({ notFound: vi.fn() }));
vi.mock("@/components/layout/MainLayout", () => ({ default: () => null }));
vi.mock("@/components/layout/StoryCard", () => ({ default: () => null }));
vi.mock("@/components/layout/StoryActions", () => ({ default: () => null }));
vi.mock("@/components/icons/BlueskyIcon", () => ({ default: () => null }));
vi.mock("@/lib/imagePlaceholders.json", () => ({ default: {} }));
vi.mock("@/utils/stringHelpers", () => ({
  normalizeImagePath: (path: string) => path.replace(/^(\.\.\/)+/, "/"),
}));
vi.mock("@/utils/content", () => ({
  getAllArticles: vi.fn().mockReturnValue([]),
  getArticle: vi.fn(),
  getArticleSlugs: vi.fn().mockReturnValue([]),
  jaccardDistance: vi.fn().mockReturnValue(1),
}));
vi.mock("@/content/stories/beautiful-analysis/index.mdx", () => ({
  default: () => null,
}));

import { notFound } from "next/navigation";
import { getArticle, getArticleSlugs } from "@/utils/content";
import ArticlePage, { generateMetadata, generateStaticParams } from "./page";

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

describe("generateStaticParams", () => {
  it("maps article slugs to param objects", async () => {
    vi.mocked(getArticleSlugs).mockReturnValue(["story-a", "story-b"]);
    const params = await generateStaticParams();
    expect(params).toEqual([{ slug: "story-a" }, { slug: "story-b" }]);
  });
});

describe("ArticlePage", () => {
  it("calls notFound when the article does not exist", async () => {
    vi.mocked(getArticle).mockImplementation(() => {
      throw new Error("Not found");
    });
    vi.mocked(notFound).mockImplementation(() => {
      throw new Error("notFound called");
    });

    await expect(
      ArticlePage({ params: Promise.resolve({ slug: "nonexistent" }) }),
    ).rejects.toThrow("notFound called");

    expect(notFound).toHaveBeenCalled();
  });

  it("renders without crashing for a slug with no story module (coming soon)", async () => {
    vi.mocked(notFound).mockReset();
    vi.mocked(getArticle).mockReturnValue({
      frontmatter: mockFrontmatter,
      slug: "unported-story",
    });

    const result = await ArticlePage({
      params: Promise.resolve({ slug: "unported-story" }),
    });
    expect(result).toBeTruthy();
  });

  it("renders without crashing for a slug with a story module", async () => {
    vi.mocked(getArticle).mockReturnValue({
      frontmatter: mockFrontmatter,
      slug: "beautiful-analysis",
    });

    const result = await ArticlePage({
      params: Promise.resolve({ slug: "beautiful-analysis" }),
    });
    expect(result).toBeTruthy();
  });
});
