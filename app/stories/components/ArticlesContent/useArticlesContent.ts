"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { STORY_SORT_QUERY_PARAM } from "@/lib/constants";
import type { ArticleMeta } from "@/utils/content";
import {
  parseSortParam,
  type StorySort,
  type StoryView,
  sortArticles,
  sortParamFor,
  withQueryParam,
} from "./utils";

export function useArticlesContent(articles: ArticleMeta[]) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sort, setSort] = useState<StorySort>(() =>
    parseSortParam(searchParams.get(STORY_SORT_QUERY_PARAM)),
  );

  useEffect(() => {
    setSort(parseSortParam(searchParams.get(STORY_SORT_QUERY_PARAM)));
  }, [searchParams]);

  const { view, reversed } = sort;

  const sortedArticles = useMemo(
    () =>
      view === "similarity" ? articles : sortArticles(articles, view, reversed),
    [articles, view, reversed],
  );

  const selectView = (nextView: StoryView) => {
    const nextSort =
      nextView === view
        ? { view, reversed: view !== "similarity" && !reversed }
        : { view: nextView, reversed: false };
    setSort(nextSort);
    const query = withQueryParam(
      window.location.search,
      STORY_SORT_QUERY_PARAM,
      sortParamFor(nextSort),
    );
    const { pathname, hash } = window.location;
    router.push(query ? `?${query}${hash}` : `${pathname}${hash}`, {
      scroll: false,
    });
  };

  return { view, reversed, selectView, sortedArticles };
}
