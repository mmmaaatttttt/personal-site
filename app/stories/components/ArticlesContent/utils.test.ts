import { describe, expect, it } from "vitest";
import type { ArticleMeta } from "@/utils/content";
import {
  parseSortParam,
  sortArticles,
  sortParamFor,
  withQueryParam,
} from "./utils";

const articles = [
  { slug: "middle", title: "beta", rawDate: "2020-05-01" },
  { slug: "newest", title: "Gamma", rawDate: "2026-01-01" },
  { slug: "oldest", title: "Alpha", rawDate: "2017-11-22" },
] as unknown as ArticleMeta[];

const slugsOf = (sorted: ArticleMeta[]) => sorted.map(({ slug }) => slug);

describe("sortArticles", () => {
  it("sorts by date newest first", () => {
    expect(slugsOf(sortArticles(articles, "date", false))).toEqual([
      "newest",
      "middle",
      "oldest",
    ]);
  });

  it("sorts by date oldest first when reversed", () => {
    expect(slugsOf(sortArticles(articles, "date", true))).toEqual([
      "oldest",
      "middle",
      "newest",
    ]);
  });

  it("sorts by title alphabetically, ignoring case", () => {
    expect(slugsOf(sortArticles(articles, "title", false))).toEqual([
      "oldest",
      "middle",
      "newest",
    ]);
  });

  it("sorts by title in reverse when reversed", () => {
    expect(slugsOf(sortArticles(articles, "title", true))).toEqual([
      "newest",
      "middle",
      "oldest",
    ]);
  });

  it("does not mutate the input", () => {
    sortArticles(articles, "title", false);
    expect(slugsOf(articles)).toEqual(["middle", "newest", "oldest"]);
  });
});

describe("parseSortParam", () => {
  it("maps each sort value to a view and direction", () => {
    expect(parseSortParam("oldest")).toEqual({ view: "date", reversed: true });
    expect(parseSortParam("a-z")).toEqual({ view: "title", reversed: false });
    expect(parseSortParam("z-a")).toEqual({ view: "title", reversed: true });
    expect(parseSortParam("similarity")).toEqual({
      view: "similarity",
      reversed: false,
    });
  });

  it("falls back to newest first for missing or unknown values", () => {
    const newest = { view: "date", reversed: false };
    expect(parseSortParam(null)).toEqual(newest);
    expect(parseSortParam("sideways")).toEqual(newest);
    expect(parseSortParam("constructor")).toEqual(newest);
  });
});

describe("sortParamFor", () => {
  it("round-trips every sort value", () => {
    for (const value of ["oldest", "a-z", "z-a", "similarity"]) {
      expect(sortParamFor(parseSortParam(value))).toBe(value);
    }
  });

  it("omits the param for the default sort", () => {
    expect(sortParamFor({ view: "date", reversed: false })).toBeNull();
  });
});

describe("withQueryParam", () => {
  it("sets a param while keeping the others", () => {
    expect(withQueryParam("?subscribe&sort=a-z", "sort", "oldest")).toBe(
      "subscribe=&sort=oldest",
    );
  });

  it("removes a param when the value is null", () => {
    expect(withQueryParam("?sort=a-z", "sort", null)).toBe("");
  });
});
