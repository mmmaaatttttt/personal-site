import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  findStructureViolations,
  listRepoFiles,
  violationsForNewFile,
} from "./structureRules.mjs";

const paths = (files: string[]) =>
  findStructureViolations(files).map((violation) => violation.path);

describe("repo structure", () => {
  it("follows the conventions in CLAUDE.md's 'Where components live'", () => {
    const violations = findStructureViolations(listRepoFiles(process.cwd()));
    expect(
      violations,
      violations
        .map((violation) => `${violation.path}\n  ${violation.reason}`)
        .join("\n"),
    ).toEqual([]);
  });
});

describe("findStructureViolations", () => {
  it("flags a tested component sitting flat outside its own folder", () => {
    expect(
      paths([
        "components/layout/StoryCard.test.tsx",
        "components/layout/StoryCard.tsx",
      ]),
    ).toEqual([
      "components/layout/StoryCard.test.tsx",
      "components/layout/StoryCard.tsx",
    ]);
  });

  it("explains where a flat component belongs", () => {
    const [violation] = findStructureViolations([
      "components/ui/Button.test.tsx",
    ]);
    expect(violation.reason).toContain("components/ui/Button/index.tsx");
  });

  it("allows foldered components, their leaf siblings, and untested flat files", () => {
    expect(
      paths([
        "components/story/shared/BarGraph/index.tsx",
        "components/story/shared/BarGraph/BarGraph.test.tsx",
        "components/story/shared/BarGraph/BarItem.tsx",
        "components/story/shared/BarGraph/BarItem.test.tsx",
        "components/icons/UntestedIcon.tsx",
        "utils/renderHelpers.test.tsx",
      ]),
    ).toEqual([]);
  });

  it("flags tests named index.test", () => {
    const [violation] = findStructureViolations([
      "components/ui/Button/index.test.tsx",
    ]);
    expect(violation.path).toBe("components/ui/Button/index.test.tsx");
    expect(violation.reason).toContain("components/ui/Button/Button.test.tsx");
  });

  it("keeps app route folders to route files and their tests", () => {
    expect(
      paths([
        "app/page.tsx",
        "app/layout.test.tsx",
        "app/rss.xml/route.ts",
        "app/stories/[slug]/page.test.ts",
        "app/stories/components/BubbleMap/utils.ts",
        "app/globals.css",
        "app/stories/ArticlesView.tsx",
        "app/stories/useArticles.ts",
      ]),
    ).toEqual(["app/stories/ArticlesView.tsx", "app/stories/useArticles.ts"]);
  });
});

describe("violationsForNewFile", () => {
  it("reports only violations caused by the new file", () => {
    const existing = ["components/layout/Footer.test.tsx"];
    expect(
      violationsForNewFile("components/layout/Footer.tsx", existing).map(
        (violation) => violation.path,
      ),
    ).toEqual(["components/layout/Footer.tsx"]);
    expect(
      violationsForNewFile("components/layout/Navbar/index.tsx", existing),
    ).toEqual([]);
  });
});

describe("listRepoFiles", () => {
  it("lists source folders recursively, skipping build output and dependencies", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "structure-"));
    for (const file of [
      "components/ui/Button/index.tsx",
      "app/page.tsx",
      "app/node_modules/pkg/index.js",
      "app/out/page.html",
      "scripts/ignored.ts",
    ]) {
      fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      fs.writeFileSync(path.join(root, file), "");
    }
    expect(listRepoFiles(root)).toEqual([
      "app/page.tsx",
      "components/ui/Button/index.tsx",
    ]);
    fs.rmSync(root, { recursive: true });
  });
});
