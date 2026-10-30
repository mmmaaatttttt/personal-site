import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ArticleMeta, StoryMap } from "@/utils/content";

vi.mock("@/components/layout/StoryCard", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="story-card">{title}</div>
  ),
}));

vi.mock("../BubbleMap", () => ({
  default: ({ storyMap }: { storyMap: StoryMap }) => (
    <div data-testid="bubble-map">{storyMap.points.length}</div>
  ),
}));

import ArticlesView from "./ArticlesView";

const articles = [
  { slug: "b", title: "Bravo" },
  { slug: "a", title: "Alpha" },
] as unknown as ArticleMeta[];

const storyMap = {
  points: [{ article: articles[0], x: 0, y: 0 }],
  links: [],
} as StoryMap;

describe("ArticlesView", () => {
  it("lists the stories in the order given", () => {
    render(
      <ArticlesView
        view="title"
        reversed={false}
        sortedArticles={articles}
        storyMap={storyMap}
      />,
    );
    expect(
      screen.getAllByTestId("story-card").map((card) => card.textContent),
    ).toEqual(["Bravo", "Alpha"]);
    expect(screen.getByRole("button", { name: "A to Z" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows the bubble map in the similarity view", () => {
    render(
      <ArticlesView
        view="similarity"
        reversed={false}
        sortedArticles={articles}
        storyMap={storyMap}
      />,
    );
    expect(screen.getByTestId("bubble-map")).toHaveTextContent("1");
    expect(screen.queryByTestId("story-card")).not.toBeInTheDocument();
  });

  it("reports view selections", () => {
    const onSelect = vi.fn();
    render(
      <ArticlesView
        view="date"
        reversed={false}
        sortedArticles={articles}
        storyMap={storyMap}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Similarity" }));
    expect(onSelect).toHaveBeenCalledWith("similarity");
  });
});
