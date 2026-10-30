import type { FC } from "react";
import StoryCard from "@/components/layout/StoryCard";
import type { ArticleMeta, StoryMap } from "@/utils/content";
import BubbleMap from "../BubbleMap";
import StoryViewControls from "./StoryViewControls";
import type { StoryView } from "./utils";

interface ArticlesViewProps {
  view: StoryView;
  reversed: boolean;
  sortedArticles: ArticleMeta[];
  storyMap: StoryMap;
  onSelect?: (view: StoryView) => void;
}

const ArticlesView: FC<ArticlesViewProps> = ({
  view,
  reversed,
  sortedArticles,
  storyMap,
  onSelect,
}) => (
  <div className="mx-auto w-full min-[890px]:w-3/5 px-4 min-[890px]:px-2 pt-10 pb-12">
    <StoryViewControls view={view} reversed={reversed} onSelect={onSelect} />
    {view === "similarity" ? (
      <BubbleMap storyMap={storyMap} />
    ) : (
      <div className="overflow-x-hidden">
        {sortedArticles.map((article, index) => (
          <StoryCard key={article.slug} {...article} index={index} />
        ))}
      </div>
    )}
  </div>
);

export default ArticlesView;
