import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import storySimilarity from "@/lib/storySimilarity.json";
import {
  chunkWords,
  extractProse,
  hashText,
  rankRelated,
  similarPairs,
} from "./similarity";

describe("extractProse", () => {
  it("keeps prose and drops imports, attributes, expressions, and code", async () => {
    const source = [
      'import Chart from "./Chart";',
      "",
      "## A p-adic heading",
      "",
      "Some *em* text with [a link](https://example.com) &mdash; and `inline` code.",
      "",
      '<Figure caption="caption text"><Chart data={rows} /></Figure>',
      "",
      "```js",
      "const hidden = 1;",
      "```",
      "",
      "![alt text](/image.png) After {value} the expression.",
    ].join("\n");
    expect(await extractProse(source)).toBe(
      "A p-adic heading Some em text with a link — and inline code. After the expression.",
    );
  });

  it("keeps text inside components, separated from neighboring blocks", async () => {
    const source = [
      "First paragraph.",
      "",
      "<Sidebar>A side note.</Sidebar>",
      "",
      "<Panel.Body>Nested text.</Panel.Body>",
      "",
      "Last paragraph.",
    ].join("\n");
    expect(await extractProse(source)).toBe(
      "First paragraph. A side note. Nested text. Last paragraph.",
    );
  });

  it("returns nothing for a story with no prose", async () => {
    expect(await extractProse('import Chart from "./Chart";')).toBe("");
  });
});

describe("chunkWords", () => {
  it("splits text into chunks of the given size", () => {
    expect(chunkWords("one two three four five", 2)).toEqual([
      "one two",
      "three four",
      "five",
    ]);
  });

  it("returns no chunks for empty text", () => {
    expect(chunkWords("", 3)).toEqual([]);
  });
});

describe("hashText", () => {
  it("returns the same hash for the same text", () => {
    expect(hashText("abc")).toBe(hashText("abc"));
  });

  it("returns different hashes for different text", () => {
    expect(hashText("abc")).not.toBe(hashText("abd"));
  });
});

describe("rankRelated", () => {
  const slugs = ["first", "second", "third", "fourth"];
  const vectors = [
    [1, 0],
    [0.9, 0.1],
    [0, 1],
    [0.1, 0.9],
  ];

  it("ranks other stories by similarity and excludes the story itself", () => {
    const related = rankRelated(slugs, vectors, 2);
    expect(related.first).toEqual(["second", "fourth"]);
    expect(related.third).toEqual(["fourth", "second"]);
  });

  it("breaks score ties alphabetically", () => {
    const related = rankRelated(
      ["origin", "beta", "alpha"],
      [
        [1, 0],
        [0, 1],
        [0, 1],
      ],
      2,
    );
    expect(related.origin).toEqual(["alpha", "beta"]);
  });
});

describe("similarPairs", () => {
  it("returns each pair at or above the cutoff once, with a rounded score", () => {
    expect(
      similarPairs(
        ["a", "b", "c"],
        [
          [1, 0],
          [0.6, 0.8],
          [0, 1],
        ],
        0.6,
      ),
    ).toEqual([
      { source: "a", target: "b", score: 0.6 },
      { source: "b", target: "c", score: 0.8 },
    ]);
  });

  it("returns nothing when no pair clears the cutoff", () => {
    expect(
      similarPairs(
        ["a", "b"],
        [
          [1, 0],
          [0, 1],
        ],
        0.1,
      ),
    ).toEqual([]);
  });
});

describe("lib/storySimilarity.json", () => {
  const storiesDir = path.join(process.cwd(), "content", "stories");
  const slugs = fs
    .readdirSync(storiesDir)
    .filter((slug) => fs.existsSync(path.join(storiesDir, slug, "index.mdx")))
    .sort();

  it("covers exactly the stories on disk", () => {
    expect(
      Object.keys(storySimilarity.stories).sort(),
      "Story list changed. Run `npm run embed-stories` and commit lib/storySimilarity.json.",
    ).toEqual(slugs);
  });

  it.each(slugs)("is up to date with the text of %s", async (slug) => {
    const text = await extractProse(
      fs.readFileSync(path.join(storiesDir, slug, "index.mdx"), "utf8"),
    );
    expect(
      storySimilarity.stories[slug as keyof typeof storySimilarity.stories]
        ?.contentHash,
      `${slug} changed. Run \`npm run embed-stories\` and commit lib/storySimilarity.json.`,
    ).toBe(hashText(text));
  });
});
