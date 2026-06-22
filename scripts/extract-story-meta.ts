import { readFileSync } from "node:fs";

const metaFile = process.argv[2];
const content = readFileSync(metaFile, "utf8");

const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
const captionMatch = content.match(/caption:\s*["']([^"']+)["']/);
const imageMatch = content.match(/featured_image:\s*["']([^"']+)["']/);

const title = titleMatch?.[1]?.trim() ?? "";
const caption = captionMatch?.[1]?.trim() ?? "";
const featured_image = imageMatch?.[1]?.trim() ?? "";

console.log(JSON.stringify({ title, caption, featured_image }));
