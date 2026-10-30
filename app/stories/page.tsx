import MainLayout from "@/components/layout/MainLayout";
import { SITE_URL } from "@/lib/constants";
import { getAllArticles, getStoryMap } from "@/utils/content";
import ArticlesContent from "./components/ArticlesContent";

export const metadata = {
  title: "Stories | Matt Lane",
  description:
    "A collection of stories at the intersection of math, equity, games, and more.",
  alternates: { canonical: `${SITE_URL}/stories` },
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();
  const storyMap = getStoryMap(articles);

  return (
    <MainLayout>
      <ArticlesContent articles={articles} storyMap={storyMap} />
    </MainLayout>
  );
}
