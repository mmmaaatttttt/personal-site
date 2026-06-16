import fs from "node:fs";
import path from "node:path";
import { slugify } from "./slugify";

export interface Heading {
  text: string;
  id: string;
}

export function getHeadings(mdxSource: string): Heading[] {
  return mdxSource
    .split("\n")
    .filter((line) => /^### /.test(line))
    .map((line) => {
      const text = line.replace(/^### /, "").trim();
      return { text, id: slugify(text) };
    });
}

export function getStoryHeadings(slug: string): Heading[] {
  const mdxPath = path.join(
    process.cwd(),
    "content",
    "stories",
    slug,
    "index.mdx",
  );
  if (!fs.existsSync(mdxPath)) return [];
  return getHeadings(fs.readFileSync(mdxPath, "utf-8").replace(/\r/g, ""));
}
