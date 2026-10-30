import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ArticleMeta, StoryMap } from "@/utils/content";

const mockSize = vi.hoisted(() => ({ width: 1000, height: 700 }));

vi.mock("@/hooks/useResizeObserver", () => ({
  useResizeObserver: () => [{ current: null }, mockSize],
}));

import BubbleMap from ".";

const article = (slug: string, title: string) =>
  ({
    slug,
    title,
    caption: `${title} caption`,
    date: "June 2026",
    timeToRead: 9,
    featured_image: `../../images/featured_images/${slug}.jpg`,
  }) as ArticleMeta;

const storyMap: StoryMap = {
  points: [
    { article: article("first", "First"), x: 0.1, y: 0.2 },
    { article: article("second", "Second"), x: 0.9, y: 0.8 },
    { article: article("third", "Third"), x: 0.5, y: 0.5 },
  ],
  links: [{ source: "first", target: "second", score: 0.4 }],
};

beforeEach(() => {
  mockSize.width = 1000;
  mockSize.height = 700;
  window.matchMedia = vi.fn().mockReturnValue({ matches: true });
});

afterEach(() => {
  Reflect.deleteProperty(window, "matchMedia");
});

describe("BubbleMap", () => {
  it("renders a link per story with its description", () => {
    render(<BubbleMap storyMap={storyMap} />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(
      screen.getByRole("link", { name: "Second" }),
    ).toHaveAccessibleDescription("June 2026 - 9 minute read. Second caption");
  });

  it("draws nothing until the stage has been measured", () => {
    mockSize.width = 0;
    mockSize.height = 0;
    render(<BubbleMap storyMap={storyMap} />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("previews the hovered story and threads it to related stories", () => {
    const { container } = render(<BubbleMap storyMap={storyMap} />);
    fireEvent.pointerOver(screen.getByRole("link", { name: "First" }), {
      pointerType: "mouse",
    });
    expect(screen.getByText("First caption")).toBeInTheDocument();
    expect(container.querySelectorAll("line")).toHaveLength(1);
    const dimmed = [...container.querySelectorAll("image.opacity-35")];
    expect(dimmed).toHaveLength(1);
    expect(dimmed[0]).toHaveAttribute(
      "href",
      "/images/featured_images/third.jpg",
    );
  });

  it("removes threads and fades the preview when the story is left", () => {
    const { container } = render(<BubbleMap storyMap={storyMap} />);
    const first = screen.getByRole("link", { name: "First" });
    fireEvent.focus(first);
    fireEvent.blur(first);
    expect(container.querySelectorAll("line")).toHaveLength(0);
    expect(
      screen.getByText("First caption").closest("[aria-hidden]"),
    ).toHaveClass("opacity-0");
  });
});
