import { resolve } from "node:path";
import type { ArticleFrontmatter } from "@/utils/content";

async function main() {
  const mod = await import(resolve(process.argv[2]));
  const { title, caption, featured_image }: ArticleFrontmatter = mod.default;
  console.log(JSON.stringify({ title, caption, featured_image }));
}

main();
