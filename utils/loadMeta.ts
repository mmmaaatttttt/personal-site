import type { ArticleFrontmatter } from "@/utils/content";

export async function loadMeta(slug: string): Promise<ArticleFrontmatter> {
  const mod = await import(`@/content/stories/${slug}/meta`);
  return mod.default as ArticleFrontmatter;
}
