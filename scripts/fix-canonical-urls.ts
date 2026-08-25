import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(__dirname, "../out");

function walkDir(dir: string, results: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, results);
    } else if (entry.name.endsWith(".html")) {
      results.push(fullPath);
    }
  }
  return results;
}

// next.config.ts sets trailingSlash: true so static export writes page/index.html
// files, but that also forces Next's metadata resolver to append a trailing slash
// to alternates.canonical — even though CloudFront serves (and redirects to) the
// no-slash URL. Strip it back out of the exported HTML so canonical matches the
// URL that's actually live, or Google excludes the real page from the index.
function stripCanonicalTrailingSlash(html: string): string {
  return html.replace(/(<link rel="canonical" href="[^"]*?)\/(")/, "$1$2");
}

function main() {
  const files = walkDir(OUT_DIR);
  let fixed = 0;

  for (const file of files) {
    const html = fs.readFileSync(file, "utf-8");
    const updated = stripCanonicalTrailingSlash(html);
    if (updated !== html) {
      fs.writeFileSync(file, updated);
      fixed++;
    }
  }

  console.log(
    `fix-canonical-urls: stripped trailing slash in ${fixed} file(s).`,
  );
}

main();
