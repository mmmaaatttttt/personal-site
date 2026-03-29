import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "content", "stories");

export interface ArticleFrontmatter {
  title: string;
  date: string;
  featured_image: string;
  caption: string;
  featured_image_caption: string;
  tags: string[];
  outline?: Array<{ title: string; hash: string }>;
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string;
}

/**
 * Get all article slugs (directory names in the articles folder).
 */
export function getArticleSlugs(): string[] {
  try {
    return fs
      .readdirSync(ARTICLES_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
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
export function getArticle(slug: string) {
  const filePath = path.join(ARTICLES_DIR, slug, "index.mdx");
  if (!fs.existsSync(filePath)) {
    throw new Error(`Article not found: ${slug}`);
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: data as ArticleFrontmatter,
    source: content,
    slug,
  };
}


/**
 * Get metadata for all articles, sorted by date descending.
 */
export function getAllArticles(): ArticleMeta[] {
  const slugs = getArticleSlugs();
  const articles = slugs.map((slug) => {
    const { frontmatter, source } = getArticle(slug);
    const timeToRead = estimateReadingTime(source);
    
    // Format date to "MMMM YYYY"
    const dateObj = new Date(frontmatter.date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return { 
      ...frontmatter, 
      date: formattedDate,
      slug,
      timeToRead 
    };
  });

  // Sort by date descending (using the original YYYY-MM-DD for sorting)
  // Wait, I should probably keep the raw date for sorting.
  // Let's refine this to keep frontmatter clean but provide formatted date.
  
  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get unique years and tags from all articles for filtering.
 */
export function getMetadataOptions(articles: ArticleMeta[]) {
  const years = Array.from(
    new Set(articles.map((a) => new Date(a.date).getFullYear()))
  ).sort((a, b) => b - a);

  const tags = Array.from(
    new Set(articles.flatMap((a) => a.tags))
  ).sort();

  return { years, tags };
}

/**
 * Compute Jaccard distance between two arrays of strings.
 * Used for finding related articles by tag similarity.
 */
export function jaccardDistance(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 1;
  return 1 - intersection.size / union.size;
}

/**
 * Estimate reading time in minutes based on word count.
 */
export function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
