"use client";

import { type FC, Suspense } from "react";
import type { ArticleMeta, StoryMap } from "@/utils/content";
import ArticlesContentInner from "./ArticlesContentInner";
import ArticlesView from "./ArticlesView";
import { sortArticles } from "./utils";

interface ArticlesContentProps {
  articles: ArticleMeta[];
  storyMap: StoryMap;
}

const ArticlesContent: FC<ArticlesContentProps> = ({ articles, storyMap }) => (
  <Suspense
    fallback={
      <div className="invisible">
        <ArticlesView
          view="date"
          reversed={false}
          sortedArticles={sortArticles(articles, "date", false)}
          storyMap={storyMap}
        />
      </div>
    }
  >
    <ArticlesContentInner articles={articles} storyMap={storyMap} />
  </Suspense>
);

export default ArticlesContent;
