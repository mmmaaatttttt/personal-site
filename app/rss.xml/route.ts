import { SITE_URL } from "@/lib/constants";
import { getAllArticles } from "@/utils/content";

export const dynamic = "force-static";

export async function GET() {
  const articles = await getAllArticles();

  const items = articles
    .map(
      (article) => `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${SITE_URL}/stories/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/stories/${article.slug}</guid>
      <description><![CDATA[${article.caption}]]></description>
      <pubDate>${new Date(article.rawDate).toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Matt Lane</title>
    <link>${SITE_URL}/</link>
    <description>Stories at the intersection of math, equity, games, and more.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
