import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ArticleMeta } from "@/utils/content";

const navigation = vi.hoisted(() => ({
  params: new URLSearchParams(),
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => navigation.params,
  useRouter: () => ({ push: navigation.push }),
}));

import { useArticlesContent } from "./useArticlesContent";

const articles = [
  { slug: "a", title: "Alpha", rawDate: "2020-01-01" },
  { slug: "b", title: "Bravo", rawDate: "2024-01-01" },
] as unknown as ArticleMeta[];

const slugs = (sorted: ArticleMeta[]) => sorted.map(({ slug }) => slug);

beforeEach(() => {
  navigation.params = new URLSearchParams();
  navigation.push.mockClear();
  window.history.replaceState(null, "", "/stories");
});

describe("useArticlesContent", () => {
  it("starts in date view, newest first", () => {
    const { result } = renderHook(() => useArticlesContent(articles));
    expect(result.current.view).toBe("date");
    expect(result.current.reversed).toBe(false);
    expect(slugs(result.current.sortedArticles)).toEqual(["b", "a"]);
  });

  it("starts from the sort in the URL", () => {
    navigation.params = new URLSearchParams("sort=z-a");
    const { result } = renderHook(() => useArticlesContent(articles));
    expect(result.current.view).toBe("title");
    expect(result.current.reversed).toBe(true);
    expect(slugs(result.current.sortedArticles)).toEqual(["b", "a"]);
  });

  it("follows the URL when it changes", () => {
    const { result, rerender } = renderHook(() => useArticlesContent(articles));
    navigation.params = new URLSearchParams("sort=similarity");
    rerender();
    expect(result.current.view).toBe("similarity");
  });

  it("reverses the order when the active view is selected again", () => {
    const { result } = renderHook(() => useArticlesContent(articles));
    act(() => result.current.selectView("date"));
    expect(result.current.reversed).toBe(true);
    expect(slugs(result.current.sortedArticles)).toEqual(["a", "b"]);
    expect(navigation.push).toHaveBeenLastCalledWith("?sort=oldest", {
      scroll: false,
    });
    act(() => result.current.selectView("date"));
    expect(result.current.reversed).toBe(false);
    expect(navigation.push).toHaveBeenLastCalledWith("/stories", {
      scroll: false,
    });
  });

  it("switches views in their natural order and keeps other params and the hash", () => {
    window.history.replaceState(null, "", "/stories?subscribe#top");
    const { result } = renderHook(() => useArticlesContent(articles));
    act(() => result.current.selectView("date"));
    act(() => result.current.selectView("title"));
    expect(result.current.view).toBe("title");
    expect(result.current.reversed).toBe(false);
    expect(slugs(result.current.sortedArticles)).toEqual(["a", "b"]);
    expect(navigation.push).toHaveBeenLastCalledWith(
      "?subscribe=&sort=a-z#top",
      { scroll: false },
    );
  });

  it("does not reverse the similarity view", () => {
    const { result } = renderHook(() => useArticlesContent(articles));
    act(() => result.current.selectView("similarity"));
    act(() => result.current.selectView("similarity"));
    expect(result.current.view).toBe("similarity");
    expect(result.current.reversed).toBe(false);
    expect(result.current.sortedArticles).toBe(articles);
    expect(navigation.push).toHaveBeenLastCalledWith("?sort=similarity", {
      scroll: false,
    });
  });
});
