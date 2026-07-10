import { describe, expect, it, vi } from "vitest";

const mockPlaceholders = vi.hoisted(() => ({}) as Record<string, string>);

vi.mock("next/image", () => ({ default: () => null }));
vi.mock("next/navigation", () => ({ notFound: vi.fn() }));
vi.mock("@/components/layout/MainLayout", () => ({ default: () => null }));
vi.mock("@/components/layout/ScrollProgressBar", () => ({
  default: () => null,
}));
vi.mock("@/components/layout/StoryCard", () => ({ default: () => null }));
vi.mock("@/components/layout/StoryActions", () => ({ default: () => null }));
vi.mock("@/components/icons/BlueskyIcon", () => ({ default: () => null }));
vi.mock("@/lib/imagePlaceholders.json", () => ({
  default: mockPlaceholders,
}));
vi.mock("@/utils/stringHelpers", () => ({
  normalizeImagePath: (path: string) => path.replace(/^(\.\.\/)+/, "/"),
}));
vi.mock("@/utils/content", () => ({
  getAllArticles: vi.fn().mockResolvedValue([]),
  getArticle: vi.fn(),
  getArticleSlugs: vi.fn().mockReturnValue([]),
  jaccardDistance: vi.fn().mockReturnValue(1),
}));
vi.mock("@/utils/headings", () => ({
  getStoryHeadings: vi.fn().mockReturnValue([]),
}));
vi.mock("@/components/story/shared/TableOfContents", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/beautiful-analysis/index.mdx", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/dishing-on-petrie/index.mdx", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/four-weddings/index.mdx", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/warming-dots/index.mdx", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/gaming-relationships-linear/index.mdx", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/gaming-relationships-nonlinear/index.mdx", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/income-inequality/index.mdx", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/harvesting-wins/index.mdx", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/fairest-of-them-all/index.mdx", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/mind-the-gerrymandered-gap/index.mdx", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/strength-in-numbers/index.mdx", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/keeping-distances/index.mdx", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/dailemma/index.mdx", () => ({
  default: () => null,
}));
vi.mock("@/content/stories/dailemma-2/index.mdx", () => ({
  default: () => null,
}));

import { notFound } from "next/navigation";
import {
  getAllArticles,
  getArticle,
  getArticleSlugs,
  jaccardDistance,
} from "@/utils/content";
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
    vi.mocked(getArticle).mockResolvedValue({
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

  const allStoryModuleSlugs = [
    "beautiful-analysis",
    "dishing-on-petrie",
    "four-weddings",
    "warming-dots",
    "gaming-relationships-linear",
    "gaming-relationships-nonlinear",
    "income-inequality",
    "harvesting-wins",
    "fairest-of-them-all",
    "mind-the-gerrymandered-gap",
    "strength-in-numbers",
    "keeping-distances",
    "dailemma",
    "dailemma-2",
  ];

  it.each(
    allStoryModuleSlugs,
  )("renders without crashing for story module: %s", async (slug) => {
    vi.mocked(getArticle).mockResolvedValue({
      frontmatter: mockFrontmatter,
      slug,
    });
    const result = await ArticlePage({ params: Promise.resolve({ slug }) });
    expect(result).toBeTruthy();
  });

  it("renders without a featured_image_caption (falsy caption branch)", async () => {
    vi.mocked(getArticle).mockResolvedValue({
      frontmatter: {
        ...mockFrontmatter,
        featured_image_caption: undefined as unknown as string,
      },
      slug: "beautiful-analysis",
    });

    const result = await ArticlePage({
      params: Promise.resolve({ slug: "beautiful-analysis" }),
    });
    expect(result).toBeTruthy();
  });

  it("uses blur placeholder when blurDataURL is available", async () => {
    mockPlaceholders["/images/featured_images/test.jpg"] =
      "data:image/jpeg;base64,test";
    vi.mocked(getArticle).mockResolvedValue({
      frontmatter: mockFrontmatter,
      slug: "beautiful-analysis",
    });

    const result = await ArticlePage({
      params: Promise.resolve({ slug: "beautiful-analysis" }),
    });
    expect(result).toBeTruthy();
    delete mockPlaceholders["/images/featured_images/test.jpg"];
  });

  it("reads timeToRead from getAllArticles when the slug is present", async () => {
    vi.mocked(getAllArticles).mockResolvedValueOnce([
      {
        slug: "beautiful-analysis",
        title: "Unported",
        caption: "cap",
        date: "2024-01-01",
        featured_image: "/img.jpg",
        tags: ["math"],
        timeToRead: 7,
      },
    ] as unknown as Awaited<ReturnType<typeof getAllArticles>>);
    vi.mocked(getArticle).mockResolvedValue({
      frontmatter: mockFrontmatter,
      slug: "beautiful-analysis",
    });

    const result = await ArticlePage({
      params: Promise.resolve({ slug: "beautiful-analysis" }),
    });
    expect(result).toBeTruthy();
  });

  it("renders related articles when jaccard distance < 1", async () => {
    vi.mocked(jaccardDistance).mockReturnValue(0.5);
    vi.mocked(getAllArticles).mockResolvedValueOnce([
      {
        slug: "beautiful-analysis",
        title: "Unported",
        caption: "cap",
        date: "2024-01-01",
        featured_image: "/img.jpg",
        tags: ["math"],
        timeToRead: 5,
      },
      {
        slug: "related-1",
        title: "Related One",
        caption: "cap",
        date: "2024-02-01",
        featured_image: "/img.jpg",
        tags: ["math"],
        timeToRead: 3,
      },
      {
        slug: "related-2",
        title: "Related Two",
        caption: "cap",
        date: "2024-03-01",
        featured_image: "/img.jpg",
        tags: null as unknown as string[],
        timeToRead: 4,
      },
    ] as unknown as Awaited<ReturnType<typeof getAllArticles>>);
    vi.mocked(getArticle).mockResolvedValue({
      frontmatter: mockFrontmatter,
      slug: "beautiful-analysis",
    });

    const result = await ArticlePage({
      params: Promise.resolve({ slug: "beautiful-analysis" }),
    });
    expect(result).toBeTruthy();
    // reset jaccardDistance back to default
    vi.mocked(jaccardDistance).mockReturnValue(1);
  });
});
