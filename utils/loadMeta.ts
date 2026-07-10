import type { ArticleFrontmatter } from "@/utils/content";

export async function loadMeta(slug: string): Promise<ArticleFrontmatter> {
  // biome-ignore lint/style/useTemplate: template literal here creates an uncoverable synthetic statement in V8's coverage instrumentation of dynamic import()
  const path = "@/content/stories/" + slug + "/meta.ts";
  const mod = await import(path);
  return mod.default as ArticleFrontmatter;
}
