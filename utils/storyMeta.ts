import type { ArticleFrontmatter } from "@/utils/content";
import fourWeddings from "@/content/stories/four-weddings/meta";
import beautifulAnalysis from "@/content/stories/beautiful-analysis/meta";
import dishingOnPetrie from "@/content/stories/dishing-on-petrie/meta";

/**
 * Typed metadata for ported stories. getArticle() checks here first;
 * non-ported stories fall back to gray-matter parsing of their MDX frontmatter.
 *
 * Add an entry here when porting a new story.
 */
export const storyMeta: Record<string, ArticleFrontmatter> = {
  "four-weddings": fourWeddings,
  "beautiful-analysis": beautifulAnalysis,
  "dishing-on-petrie": dishingOnPetrie,
};
