import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ArticleMeta, StoryMap } from "@/utils/content";

const inner = vi.hoisted(() => ({ suspend: false }));

vi.mock("./ArticlesContentInner", () => ({
  default: ({ articles }: { articles: ArticleMeta[] }) => {
    if (inner.suspend) throw new Promise(() => {});
    return <div data-testid="inner">{articles.length}</div>;
  },
}));

vi.mock("@/components/layout/StoryCard", () => ({
  default: ({ title }: { title: string }) => <p>{title}</p>,
}));

import ArticlesContent from ".";

const articles = [
  { slug: "a", title: "Alpha", rawDate: "2020-01-01" },
  { slug: "b", title: "Bravo", rawDate: "2024-01-01" },
] as unknown as ArticleMeta[];

const renderContent = () =>
  render(
    <ArticlesContent
      articles={articles}
      storyMap={{ points: [], links: [] } as StoryMap}
    />,
  );

beforeEach(() => {
  inner.suspend = false;
});

describe("ArticlesContent", () => {
  it("renders the URL-aware content", () => {
    renderContent();
    expect(screen.getByTestId("inner")).toHaveTextContent("2");
  });

  it("holds an invisible newest-first list until the URL is known", () => {
    inner.suspend = true;
    renderContent();
    const bravo = screen.getByText("Bravo");
    expect(bravo.closest(".invisible")).toBeInTheDocument();
    expect(
      screen.getAllByText(/Alpha|Bravo/).map((node) => node.textContent),
    ).toEqual(["Bravo", "Alpha"]);
  });
});
