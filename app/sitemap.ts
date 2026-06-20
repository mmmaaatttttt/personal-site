import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllArticles } from "@/utils/content";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stories = (await getAllArticles()).map((article) => ({
    url: `${SITE_URL}/stories/${article.slug}/`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/stories/`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about/`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...stories,
  ];
}
