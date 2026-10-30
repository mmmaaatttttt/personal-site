"use client";

import type { FC } from "react";
import type { ArticleMeta, StoryMap } from "@/utils/content";
import ArticlesView from "./ArticlesView";
import { useArticlesContent } from "./useArticlesContent";

interface ArticlesContentInnerProps {
  articles: ArticleMeta[];
  storyMap: StoryMap;
}

const ArticlesContentInner: FC<ArticlesContentInnerProps> = ({
  articles,
  storyMap,
}) => {
  const { view, reversed, selectView, sortedArticles } =
    useArticlesContent(articles);

  return (
    <ArticlesView
      view={view}
      reversed={reversed}
      sortedArticles={sortedArticles}
      storyMap={storyMap}
      onSelect={selectView}
    />
  );
};

export default ArticlesContentInner;
