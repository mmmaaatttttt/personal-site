import fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ArticleMeta } from "./content";
import {
  estimateReadingTime,
  getAllArticles,
  getArticle,
  getArticleSlugs,
  getMetadataOptions,
  jaccardDistance,
} from "./content";

vi.mock("node:fs", () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    readdirSync: vi.fn(),
  },
}));

vi.mock("gray-matter", () => ({
  default: vi.fn((raw: string) => ({ data: {}, content: raw })),
}));

vi.mock("@/utils/storyMeta", () => ({
  storyMeta: {
    "test-story": {
      title: "Test Story",
      date: "2024-03-01",
      featured_image: "/img/test.jpg",
      caption: "A test",
      featured_image_caption: "",
      tags: ["math", "games"],
    },
    "older-story": {
      title: "Older Story",
      date: "2023-01-15",
      featured_image: "/img/older.jpg",
      caption: "An older test",
      featured_image_caption: "",
      tags: ["math"],
    },
  },
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

describe("jaccardDistance", () => {
  it("returns 0 for identical arrays", () => {
    expect(jaccardDistance(["a", "b", "c"], ["a", "b", "c"])).toBe(0);
  });

  it("returns 1 for completely disjoint arrays", () => {
    expect(jaccardDistance(["a", "b"], ["c", "d"])).toBe(1);
  });

  it("returns 1 for two empty arrays", () => {
    expect(jaccardDistance([], [])).toBe(1);
  });

  it("returns 0.5 for half-overlapping arrays", () => {
    // intersection {a}, union {a, b} → distance = 1 - 1/2 = 0.5
    expect(jaccardDistance(["a", "b"], ["a"])).toBe(0.5);
  });

  it("returns a value between 0 and 1 for partial overlap", () => {
    const d = jaccardDistance(
      ["math", "probability", "games"],
      ["games", "politics"],
    );
    expect(d).toBeGreaterThan(0);
    expect(d).toBeLessThan(1);
  });

  it("is symmetric", () => {
    const a = ["math", "probability"];
    const b = ["games", "probability"];
    expect(jaccardDistance(a, b)).toBe(jaccardDistance(b, a));
  });

  it("returns 0 when one array is a subset of the other (same elements)", () => {
    expect(jaccardDistance(["a"], ["a", "a"])).toBe(0);
  });
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
  it("returns frontmatter from storyMeta when available", () => {
    const { frontmatter } = getArticle("test-story");
    expect(frontmatter.title).toBe("Test Story");
  });

  it("falls back to gray-matter when slug not in storyMeta", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    const { frontmatter, slug } = getArticle("unknown-story");
    expect(slug).toBe("unknown-story");
    expect(frontmatter).toBeDefined();
  });

  it("throws when the MDX file does not exist", () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(() => getArticle("missing-story")).toThrow("Article not found");
  });
});

describe("getAllArticles", () => {
  it("returns an array of articles with the expected shape", () => {
    const articles = getAllArticles();
    expect(articles).toHaveLength(1);
    expect(articles[0]).toMatchObject({
      slug: "test-story",
      title: "Test Story",
      tags: ["math", "games"],
      timeToRead: expect.any(Number),
    });
  });

  it("sorts articles by date descending", () => {
    vi.mocked(fs.readdirSync).mockReturnValueOnce(
      asDirents([mockDirent("older-story"), mockDirent("test-story")]),
    );
    const articles = getAllArticles();
    expect(articles[0].slug).toBe("test-story");
    expect(articles[1].slug).toBe("older-story");
  });
});

describe("getMetadataOptions", () => {
  it("extracts unique sorted tags", () => {
    const articles = [
      { tags: ["math", "games"], date: "2024-01-01" },
      { tags: ["games", "politics"], date: "2023-06-01" },
    ] as unknown as ArticleMeta[];
    const { tags } = getMetadataOptions(articles);
    expect(tags).toEqual(["games", "math", "politics"]);
  });

  it("extracts unique years sorted descending", () => {
    const articles = [
      { tags: [], date: "2023-07-01" },
      { tags: [], date: "2024-07-01" },
    ] as unknown as ArticleMeta[];
    const { years } = getMetadataOptions(articles);
    expect(years).toEqual([2024, 2023]);
  });
});
