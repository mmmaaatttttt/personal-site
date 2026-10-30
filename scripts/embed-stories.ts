import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "@huggingface/transformers";
import { UMAP } from "umap-js";
import {
  centerAndNormalize,
  meanVector,
  normalizeVector,
  scaleToUnitSquare,
  seededRandom,
  type Vector,
} from "@/utils/mathHelpers";
import {
  chunkWords,
  extractProse,
  hashText,
  rankRelated,
  similarPairs,
} from "@/utils/similarity";

const ROOT = path.join(__dirname, "..");
const STORIES_DIR = path.join(ROOT, "content", "stories");
const OUTPUT_PATH = path.join(ROOT, "lib", "storySimilarity.json");

const MODEL = "Xenova/bge-base-en-v1.5";
const MODEL_REVISION = "4d6cd88e18e51a5e020c2c305726d76ada9c03cf";
const CHUNK_WORDS = 250;
const RELATED_COUNT = 3;
const LINK_CUTOFF = 0.1;
const UMAP_SEED = 42;

async function main() {
  const slugs = fs
    .readdirSync(STORIES_DIR)
    .filter((slug) => fs.existsSync(path.join(STORIES_DIR, slug, "index.mdx")))
    .sort();
  const texts = await Promise.all(
    slugs.map((slug) =>
      extractProse(
        fs.readFileSync(path.join(STORIES_DIR, slug, "index.mdx"), "utf8"),
      ),
    ),
  );

  const extractor = await pipeline("feature-extraction", MODEL, {
    revision: MODEL_REVISION,
    dtype: "fp32",
  });

  const vectors: Vector[] = [];
  for (const [index, text] of texts.entries()) {
    const chunkVectors: Vector[] = [];
    for (const chunk of chunkWords(text, CHUNK_WORDS)) {
      const output = await extractor(chunk, {
        pooling: "mean",
        normalize: true,
      });
      chunkVectors.push(output.tolist()[0]);
    }
    vectors.push(normalizeVector(meanVector(chunkVectors)));
    console.log(`Embedded ${slugs[index]} (${chunkVectors.length} chunks)`);
  }

  const centered = centerAndNormalize(vectors);
  const related = rankRelated(slugs, centered, RELATED_COUNT);
  const umap = new UMAP({
    nComponents: 2,
    nNeighbors: Math.min(5, slugs.length - 1),
    minDist: 0.3,
    random: seededRandom(UMAP_SEED),
  });
  const positions = scaleToUnitSquare(umap.fit(centered) as [number, number][]);

  const output = {
    model: MODEL,
    revision: MODEL_REVISION,
    stories: Object.fromEntries(
      slugs.map((slug, index) => [
        slug,
        {
          contentHash: hashText(texts[index]),
          position: positions[index].map(
            (value) => Math.round(value * 10000) / 10000,
          ),
          related: related[slug],
        },
      ]),
    ),
    links: similarPairs(slugs, centered, LINK_CUTOFF),
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  execFileSync("npx", ["biome", "check", "--write", OUTPUT_PATH], {
    cwd: ROOT,
    stdio: "inherit",
  });
  console.log(`Wrote ${slugs.length} stories to lib/storySimilarity.json`);
}

main();
