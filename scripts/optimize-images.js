const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const TARGET_WIDTHS = [640, 828, 1080, 1200, 1920];
const INPUT_DIR = path.join(__dirname, "../public/images");
const OUTPUT_DIR = path.join(__dirname, "../public/images/_optimized");

function walkDir(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "_optimized") walkDir(fullPath, results);
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function processImage(srcPath) {
  const srcStat = fs.statSync(srcPath);
  const filename = `${path.basename(srcPath, path.extname(srcPath))}.webp`;
  const relativeName = path.relative(INPUT_DIR, path.dirname(srcPath));

  const meta = await sharp(srcPath).metadata();
  const srcWidth = meta.width ?? Infinity;

  let generated = 0;
  let skipped = 0;

  for (const w of TARGET_WIDTHS) {
    if (w > srcWidth) continue;

    const outDir =
      relativeName === "."
        ? path.join(OUTPUT_DIR, String(w))
        : path.join(OUTPUT_DIR, String(w), relativeName);

    const outPath = path.join(outDir, filename);

    if (fs.existsSync(outPath)) {
      const outStat = fs.statSync(outPath);
      if (outStat.mtimeMs >= srcStat.mtimeMs) {
        skipped++;
        continue;
      }
    }

    fs.mkdirSync(outDir, { recursive: true });
    await sharp(srcPath).resize(w).webp().toFile(outPath);
    generated++;
    console.log(`  generated ${path.relative(process.cwd(), outPath)}`);
  }

  return { generated, skipped };
}

async function main() {
  const images = walkDir(INPUT_DIR);
  console.log(`Found ${images.length} image(s) in public/images/\n`);

  let totalGenerated = 0;
  let totalSkipped = 0;

  for (const imgPath of images) {
    const rel = path.relative(process.cwd(), imgPath);
    const { generated, skipped } = await processImage(imgPath);
    if (generated > 0 || skipped > 0) {
      console.log(`${rel}: ${generated} generated, ${skipped} skipped`);
    }
    totalGenerated += generated;
    totalSkipped += skipped;
  }

  console.log(
    `\nDone — ${totalGenerated} variant(s) generated, ${totalSkipped} already up-to-date.`,
  );
}

main().catch((err) => {
  console.error("optimize-images failed:", err);
  process.exit(1);
});
