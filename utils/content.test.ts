import fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ArticleMeta } from "./content";
import {
  estimateReadingTime,
  getAllArticles,
  getArticle,
  getArticleSlugs,
  getLatestStory,
  getRelatedArticles,
  getStoryMap,
} from "./content";

vi.mock("node:fs", () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    readdirSync: vi.fn(),
  },
}));

vi.mock("@/lib/storySimilarity.json", () => ({
  default: {
    stories: {
      "test-story": {
        position: [0.25, 0.75],
        related: ["older-story", "gone"],
      },
      "older-story": { position: [1, 0], related: [] },
    },
    links: [
      { source: "older-story", target: "test-story", score: 0.4 },
      { source: "gone", target: "test-story", score: 0.3 },
    ],
  },
}));

vi.mock("gray-matter", () => ({
  default: vi.fn((raw: string) => ({ data: {}, content: raw })),
}));

const mockMetas: Record<string, import("./content").ArticleFrontmatter> = {
  "test-story": {
    title: "Test Story",
    date: "2024-03-01",
    featured_image: "/img/test.jpg",
    caption: "A test",
    featured_image_caption: "",
  },
  "older-story": {
    title: "Older Story",
    date: "2023-01-15",
    featured_image: "/img/older.jpg",
    caption: "An older test",
    featured_image_caption: "",
  },
};

vi.mock("./loadMeta", () => ({
  loadMeta: vi.fn().mockImplementation(async (slug: string) => {
    if (mockMetas[slug]) return mockMetas[slug];
    throw new Error("Module not found");
  }),
}));

const mockDirent = (name: string, isDir = true) =>
  ({ name, isDirectory: () => isDir }) as unknown as fs.Dirent;

const asDirents = (dirents: ReturnType<typeof mockDirent>[]) =>
  dirents as unknown as ReturnType<typeof fs.readdirSync>;

beforeEach(() => {
  vi.mocked(fs.existsSync).mockReturnValue(true);
  vi.mocked(fs.readFileSync).mockReturnValue(
    "word ".repeat(400) as unknown as ReturnType<typeof fs.readFileSync>,
  );
  vi.mocked(fs.readdirSync).mockReturnValue(
    asDirents([mockDirent("test-story")]),
  );
});

describe("estimateReadingTime", () => {
  it("returns 1 for very short content", () => {
    expect(estimateReadingTime("just a few words")).toBe(1);
  });

  it("returns proportional time for longer content", () => {
    const words = "word ".repeat(400);
    expect(estimateReadingTime(words)).toBe(2);
  });

  it("returns 1 for empty string", () => {
    expect(estimateReadingTime("")).toBe(1);
  });
});

describe("getArticleSlugs", () => {
  it("returns directory names that contain index.mdx", () => {
    vi.mocked(fs.readdirSync).mockReturnValue(
      asDirents([
        mockDirent("story-one"),
        mockDirent("story-two"),
        mockDirent("not-a-dir", false),
      ]),
    );
    expect(getArticleSlugs()).toEqual(["story-one", "story-two"]);
  });

  it("excludes directories without index.mdx", () => {
    vi.mocked(fs.readdirSync).mockReturnValue(
      asDirents([mockDirent("story-one"), mockDirent("in-progress")]),
    );
    vi.mocked(fs.existsSync).mockImplementation((p) =>
      String(p).includes("story-one"),
    );
    expect(getArticleSlugs()).toEqual(["story-one"]);
  });

  it("returns empty array when directory read fails", () => {
    vi.mocked(fs.readdirSync).mockImplementation(() => {
      throw new Error("ENOENT");
    });
    expect(getArticleSlugs()).toEqual([]);
  });
});

describe("getArticle", () => {
  it("returns frontmatter from meta.ts when available", async () => {
    const { frontmatter } = await getArticle("test-story");
    expect(frontmatter.title).toBe("Test Story");
  });

  it("falls back to gray-matter when no meta.ts exists", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    const { frontmatter, slug } = await getArticle("unknown-story");
    expect(slug).toBe("unknown-story");
    expect(frontmatter).toBeDefined();
  });

  it("throws when the MDX file does not exist", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    await expect(getArticle("missing-story")).rejects.toThrow(
      "Article not found",
    );
  });
});

describe("getAllArticles", () => {
  it("returns an array of articles with the expected shape", async () => {
    const articles = await getAllArticles();
    expect(articles).toHaveLength(1);
    expect(articles[0]).toMatchObject({
      slug: "test-story",
      title: "Test Story",
      timeToRead: expect.any(Number),
    });
  });

  it("sorts articles by date descending", async () => {
    vi.mocked(fs.readdirSync).mockReturnValueOnce(
      asDirents([mockDirent("older-story"), mockDirent("test-story")]),
    );
    const articles = await getAllArticles();
    expect(articles[0].slug).toBe("test-story");
    expect(articles[1].slug).toBe("older-story");
  });
});

describe("getLatestStory", () => {
  it("returns the first article from getAllArticles", async () => {
    const latest = await getLatestStory();
    expect(latest.slug).toBe("test-story");
  });
});

describe("getRelatedArticles", () => {
  const articles = [
    { slug: "test-story" },
    { slug: "older-story" },
  ] as unknown as ArticleMeta[];

  it("returns related articles in ranked order, skipping unknown slugs", () => {
    expect(getRelatedArticles("test-story", articles)).toEqual([
      { slug: "older-story" },
    ]);
  });

  it("returns an empty list for a story without similarity data", () => {
    expect(getRelatedArticles("missing-story", articles)).toEqual([]);
  });
});

describe("getStoryMap", () => {
  it("positions known articles and keeps links between them", () => {
    const articles = [
      { slug: "test-story" },
      { slug: "older-story" },
      { slug: "missing-story" },
    ] as unknown as ArticleMeta[];
    expect(getStoryMap(articles)).toEqual({
      points: [
        { article: { slug: "test-story" }, x: 0.25, y: 0.75 },
        { article: { slug: "older-story" }, x: 1, y: 0 },
      ],
      links: [{ source: "older-story", target: "test-story", score: 0.4 }],
    });
  });
});
