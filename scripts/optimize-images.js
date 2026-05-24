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
  let maxGeneratedWidth = 0;

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
        maxGeneratedWidth = w;
        continue;
      }
    }

    fs.mkdirSync(outDir, { recursive: true });
    await sharp(srcPath).resize(w).webp().toFile(outPath);
    generated++;
    maxGeneratedWidth = w;
    console.log(`  generated ${path.relative(process.cwd(), outPath)}`);
  }

  return { generated, skipped, maxGeneratedWidth };
}

async function generatePlaceholders(images) {
  const manifest = {};
  for (const imgPath of images) {
    const relative = path.relative(INPUT_DIR, imgPath);
    if (!relative.startsWith("featured_images")) continue;
    const buf = await sharp(imgPath).resize(8).webp({ quality: 20 }).toBuffer();
    const key = `/images/${relative.replace(/\\/g, "/")}`;
    manifest[key] = `data:image/webp;base64,${buf.toString("base64")}`;
  }
  return manifest;
}

async function main() {
  const images = walkDir(INPUT_DIR);
  console.log(`Found ${images.length} image(s) in public/images/\n`);

  let totalGenerated = 0;
  let totalSkipped = 0;
  const maxWidths = {};

  for (const imgPath of images) {
    const rel = path.relative(process.cwd(), imgPath);
    const { generated, skipped, maxGeneratedWidth } =
      await processImage(imgPath);
    if (generated > 0 || skipped > 0) {
      console.log(`${rel}: ${generated} generated, ${skipped} skipped`);
    }
    totalGenerated += generated;
    totalSkipped += skipped;
    if (maxGeneratedWidth > 0) {
      const key = `/images/${path.relative(INPUT_DIR, imgPath).replace(/\\/g, "/")}`;
      maxWidths[key] = maxGeneratedWidth;
    }
  }

  console.log(
    `\nDone — ${totalGenerated} variant(s) generated, ${totalSkipped} already up-to-date.`,
  );

  const widthsPath = path.join(__dirname, "../lib/imageWidths.json");
  fs.writeFileSync(widthsPath, `${JSON.stringify(maxWidths, null, 2)}\n`);
  console.log(
    `Wrote ${Object.keys(maxWidths).length} width entries to lib/imageWidths.json`,
  );

  const manifest = await generatePlaceholders(images);
  const manifestPath = path.join(__dirname, "../lib/imagePlaceholders.json");
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `Wrote ${Object.keys(manifest).length} placeholder(s) to lib/imagePlaceholders.json`,
  );
}

main().catch((err) => {
  console.error("optimize-images failed:", err);
  process.exit(1);
});
