import { beforeEach, describe, expect, it, vi } from "vitest";
import { getHeadings, getStoryHeadings } from "./headings";

const { mockExistsSync, mockReadFileSync } = vi.hoisted(() => ({
  mockExistsSync: vi.fn(),
  mockReadFileSync: vi.fn(),
}));

vi.mock("node:fs", () => ({
  default: {
    existsSync: mockExistsSync,
    readFileSync: mockReadFileSync,
  },
}));
vi.mock("node:path", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:path")>();
  return { ...actual, join: (...args: string[]) => args.join("/") };
});

describe("getHeadings", () => {
  it("returns empty array for empty source", () => {
    expect(getHeadings("")).toEqual([]);
  });

  it("extracts h3 headings and slugifies them", () => {
    const source = "### Hello World\n### What's Next?\n";
    expect(getHeadings(source)).toEqual([
      { text: "Hello World", id: "hello-world" },
      { text: "What's Next?", id: "whats-next" },
    ]);
  });

  it("ignores h4 and deeper headings", () => {
    const source = "#### Not Included\n### Included\n";
    expect(getHeadings(source)).toEqual([{ text: "Included", id: "included" }]);
  });

  it("ignores h1 and h2 headings", () => {
    const source = "# H1\n## H2\n### H3\n";
    expect(getHeadings(source)).toEqual([{ text: "H3", id: "h3" }]);
  });

  it("trims trailing whitespace from heading text", () => {
    expect(getHeadings("### Trailing   ")).toEqual([
      { text: "Trailing", id: "trailing" },
    ]);
  });

  it("skips lines that are not headings", () => {
    const source = "Some prose.\n### Section\nMore prose.\n";
    expect(getHeadings(source)).toEqual([{ text: "Section", id: "section" }]);
  });
});

describe("getStoryHeadings", () => {
  beforeEach(() => {
    mockExistsSync.mockReset();
    mockReadFileSync.mockReset();
  });

  it("returns empty array when the mdx file does not exist", () => {
    mockExistsSync.mockReturnValue(false);
    expect(getStoryHeadings("no-such-story")).toEqual([]);
  });

  it("reads the mdx file and returns headings", () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue("### First Section\n### Second Section\n");
    expect(getStoryHeadings("my-story")).toEqual([
      { text: "First Section", id: "first-section" },
      { text: "Second Section", id: "second-section" },
    ]);
  });

  it("strips Windows line endings before parsing", () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue("### Section\r\n");
    expect(getStoryHeadings("win-story")).toEqual([
      { text: "Section", id: "section" },
    ]);
  });
});
