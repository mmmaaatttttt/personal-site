import MainLayout from "@/components/layout/MainLayout";
import { SITE_URL } from "@/lib/constants";
import { getAllArticles, getMetadataOptions } from "@/utils/content";
import ArticlesContent from "./ArticlesContent";

export const metadata = {
  title: "Stories | Matt Lane",
  description:
    "A collection of stories at the intersection of math, equity, games, and more.",
  alternates: { canonical: `${SITE_URL}/stories` },
};

export default async function ArticlesPage() {
  const articles = getAllArticles();
  const { years, tags } = getMetadataOptions(articles);

  return (
    <MainLayout>
      <ArticlesContent articles={articles} years={years} tags={tags} />
    </MainLayout>
  );
}
