import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import storySimilarity from "@/lib/storySimilarity.json";
import { loadMeta } from "@/utils/loadMeta";

const ARTICLES_DIR = path.join(process.cwd(), "content", "stories");

export interface ArticleFrontmatter {
  title: string;
  date: string;
  featured_image: string;
  caption: string;
  featured_image_caption: string;
  outline?: Array<{ title: string; hash: string }>;
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string;
  timeToRead: number;
  rawDate: string;
}

/**
 * Get all article slugs (directory names in the articles folder).
 */
export function getArticleSlugs(): string[] {
  try {
    return fs
      .readdirSync(ARTICLES_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .filter((dirent) =>
        fs.existsSync(path.join(ARTICLES_DIR, dirent.name, "index.mdx")),
      )
      .map((dirent) => dirent.name);
  } catch (e) {
    console.error("Error reading articles directory:", e);
    return [];
  }
}

/**
 * Read and parse a single MDX article file, returning frontmatter and raw MDX source.
 * Articles are now stored in content/articles/[slug]/index.mdx
 */
export async function getArticle(slug: string) {
  const mdxPath = path.join(ARTICLES_DIR, slug, "index.mdx");

  if (!fs.existsSync(mdxPath)) {
    throw new Error(`Article not found: ${slug}`);
  }

  let frontmatter: ArticleFrontmatter;
  try {
    frontmatter = await loadMeta(slug);
  } catch {
    frontmatter = matter(fs.readFileSync(mdxPath, "utf-8"))
      .data as ArticleFrontmatter;
  }

  return { frontmatter, slug };
}

/**
 * Get metadata for all articles, sorted by date descending.
 */
export async function getAllArticles(): Promise<ArticleMeta[]> {
  const slugs = getArticleSlugs();
  const articles = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getArticle(slug);
      const raw = fs.readFileSync(
        path.join(ARTICLES_DIR, slug, "index.mdx"),
        "utf-8",
      );
      const timeToRead = estimateReadingTime(matter(raw).content);

      const dateObj = new Date(frontmatter.date);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      return {
        ...frontmatter,
        date: formattedDate,
        rawDate: frontmatter.date,
        slug,
        timeToRead,
      };
    }),
  );

  return articles.sort(
    (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime(),
  );
}

export async function getLatestStory(): Promise<ArticleMeta> {
  const articles = await getAllArticles();
  return articles[0];
}

export function getRelatedArticles(
  slug: string,
  articles: ArticleMeta[],
): ArticleMeta[] {
  const stories: Record<string, { related: string[] } | undefined> =
    storySimilarity.stories;
  const relatedSlugs = stories[slug]?.related ?? [];
  return relatedSlugs.flatMap((relatedSlug) =>
    articles.filter((article) => article.slug === relatedSlug),
  );
}

export interface StoryMapPoint {
  article: ArticleMeta;
  x: number;
  y: number;
}

export interface StoryMapLink {
  source: string;
  target: string;
  score: number;
}

export interface StoryMap {
  points: StoryMapPoint[];
  links: StoryMapLink[];
}

export function getStoryMap(articles: ArticleMeta[]): StoryMap {
  const stories: Record<string, { position: number[] } | undefined> =
    storySimilarity.stories;
  const points = articles.flatMap((article) => {
    const story = stories[article.slug];
    if (!story) return [];
    const [x, y] = story.position;
    return [{ article, x, y }];
  });
  const known = new Set(points.map(({ article }) => article.slug));
  const links = storySimilarity.links.filter(
    ({ source, target }) => known.has(source) && known.has(target),
  );
  return { points, links };
}

/**
 * Estimate reading time in minutes based on word count.
 */
export function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
