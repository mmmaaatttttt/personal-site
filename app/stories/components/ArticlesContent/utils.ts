import type { ArticleMeta } from "@/utils/content";

export type StoryOrder = "date" | "title";
export type StoryView = StoryOrder | "similarity" | "random";

export interface StorySort {
  view: StoryView;
  reversed: boolean;
}

const SORT_VALUES: Record<string, StorySort> = {
  oldest: { view: "date", reversed: true },
  "a-z": { view: "title", reversed: false },
  "z-a": { view: "title", reversed: true },
  similarity: { view: "similarity", reversed: false },
};

const DEFAULT_SORT: StorySort = { view: "date", reversed: false };

export function parseSortParam(value: string | null): StorySort {
  return value !== null && Object.hasOwn(SORT_VALUES, value)
    ? SORT_VALUES[value]
    : DEFAULT_SORT;
}

export function sortParamFor({ view, reversed }: StorySort): string | null {
  const match = Object.entries(SORT_VALUES).find(
    ([, sort]) => sort.view === view && sort.reversed === reversed,
  );
  return match ? match[0] : null;
}

export function withQueryParam(
  search: string,
  key: string,
  value: string | null,
): string {
  const params = new URLSearchParams(search);
  if (value === null) params.delete(key);
  else params.set(key, value);
  return params.toString();
}

export function sortArticles(
  articles: ArticleMeta[],
  order: StoryOrder,
  reversed: boolean,
): ArticleMeta[] {
  const sorted = [...articles].sort((first, second) => {
    if (order === "date") {
      return second.rawDate.localeCompare(first.rawDate);
    }
    return first.title.localeCompare(second.title, "en", {
      sensitivity: "base",
    });
  });
  return reversed ? sorted.reverse() : sorted;
}
