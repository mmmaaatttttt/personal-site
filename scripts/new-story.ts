import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(__dirname, "..");
const STORIES_DIR = path.join(ROOT, "content", "stories");
const E2E_SCREENSHOTS_DIR = path.join(ROOT, "e2e", "screenshots");
const PAGE_PATH = path.join(ROOT, "app", "stories", "[slug]", "page.tsx");

function toTitleCase(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function toObjectKey(slug: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(slug) ? slug : `"${slug}"`;
}

function metaTemplate(slug: string): string {
  const imageName = slug.replace(/-/g, "_");
  const today = new Date().toISOString().slice(0, 10);
  return `import type { ArticleFrontmatter } from "@/utils/content";

const meta: ArticleFrontmatter = {
  title: "TBD",
  date: "${today}",
  featured_image: "../../images/featured_images/${imageName}.jpg",
  caption: "TBD",
  featured_image_caption: "TBD",
  tags: [],
};

export default meta;
`;
}

function mdxTemplate(): string {
  return "TBD\n";
}

function e2eTemplate(slug: string, title: string): string {
  return `import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("${slug} story page", async ({ page }) => {
  await page.goto("/stories/${slug}");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "${title}");
});
`;
}

function insertStoryModule(slug: string): void {
  const contents = fs.readFileSync(PAGE_PATH, "utf-8");
  const key = toObjectKey(slug);
  const entry = `  ${key}: () => import("@/content/stories/${slug}/index.mdx"),\n};`;

  const anchor = "\n};";
  const mapEndIndex = contents.indexOf(anchor);
  if (mapEndIndex === -1) {
    throw new Error(`Could not find storyModules map in ${PAGE_PATH}`);
  }

  const updated =
    contents.slice(0, mapEndIndex) +
    "\n" +
    entry +
    contents.slice(mapEndIndex + anchor.length);
  fs.writeFileSync(PAGE_PATH, updated);
}

function main(): void {
  const slug = process.argv[2];

  if (!slug) {
    console.error("Usage: npm run new-story <slug>");
    process.exit(1);
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    console.error(
      `Invalid slug "${slug}": use lowercase letters, digits, and hyphens only (e.g. "my-new-story").`,
    );
    process.exit(1);
  }

  const storyDir = path.join(STORIES_DIR, slug);
  const e2ePath = path.join(E2E_SCREENSHOTS_DIR, `${slug}.spec.ts`);

  if (fs.existsSync(storyDir)) {
    console.error(`Story directory already exists: ${storyDir}`);
    process.exit(1);
  }
  if (fs.existsSync(e2ePath)) {
    console.error(`E2e spec already exists: ${e2ePath}`);
    process.exit(1);
  }

  const title = toTitleCase(slug);

  fs.mkdirSync(storyDir, { recursive: true });
  fs.writeFileSync(path.join(storyDir, "meta.ts"), metaTemplate(slug));
  fs.writeFileSync(path.join(storyDir, "index.mdx"), mdxTemplate());
  fs.writeFileSync(e2ePath, e2eTemplate(slug, title));
  insertStoryModule(slug);

  execFileSync(
    "npx",
    [
      "biome",
      "check",
      "--write",
      path.join(storyDir, "meta.ts"),
      path.join(storyDir, "index.mdx"),
      e2ePath,
      PAGE_PATH,
    ],
    { cwd: ROOT, stdio: "inherit" },
  );

  console.log(`Scaffolded story "${slug}":`);
  console.log(`  content/stories/${slug}/meta.ts`);
  console.log(`  content/stories/${slug}/index.mdx`);
  console.log(`  e2e/screenshots/${slug}.spec.ts`);
  console.log(`  registered in app/stories/[slug]/page.tsx`);
  console.log("");
  console.log(
    `Still needed: public/images/featured_images/${slug.replace(/-/g, "_")}.jpg (referenced from meta.ts), and real title/caption/tags/content.`,
  );
  console.log(
    `If the story needs a bespoke interaction test, add one by hand at e2e/interaction/${slug}.spec.ts (see e2e/interaction/dragTo.ts for the shared drag helper) — this is not scaffolded since it depends on the story's specific interactive elements.`,
  );
}

main();
