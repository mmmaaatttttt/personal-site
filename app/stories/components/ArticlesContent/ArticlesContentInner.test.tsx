import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ArticleMeta, StoryMap } from "@/utils/content";

const navigation = vi.hoisted(() => ({
  params: new URLSearchParams(),
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => navigation.params,
  useRouter: () => ({ push: navigation.push }),
}));

vi.mock("@/components/layout/StoryCard", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="story-card">{title}</div>
  ),
}));

vi.mock("../BubbleMap", () => ({
  default: () => <div data-testid="bubble-map" />,
}));

import ArticlesContentInner from "./ArticlesContentInner";

const articles = [
  { slug: "b", title: "Bravo", rawDate: "2024-01-01" },
  { slug: "a", title: "Alpha", rawDate: "2020-01-01" },
  { slug: "c", title: "Charlie", rawDate: "2022-01-01" },
] as unknown as ArticleMeta[];

const storyMap = { points: [], links: [] } as StoryMap;

const cardTitles = () =>
  screen.getAllByTestId("story-card").map((card) => card.textContent);

const renderInner = () =>
  render(<ArticlesContentInner articles={articles} storyMap={storyMap} />);

beforeEach(() => {
  navigation.params = new URLSearchParams();
  navigation.push.mockClear();
  window.history.replaceState(null, "", "/stories");
});

describe("ArticlesContentInner", () => {
  it("lists stories newest first by default", () => {
    renderInner();
    expect(cardTitles()).toEqual(["Bravo", "Charlie", "Alpha"]);
  });

  it("opens the view named in a shared link", () => {
    navigation.params = new URLSearchParams("sort=similarity");
    renderInner();
    expect(screen.getByTestId("bubble-map")).toBeInTheDocument();
  });

  it("flips the date order and updates the link", () => {
    renderInner();
    fireEvent.click(screen.getByRole("button", { name: "Newest first" }));
    expect(cardTitles()).toEqual(["Alpha", "Charlie", "Bravo"]);
    expect(
      screen.getByRole("button", { name: "Oldest first" }),
    ).toBeInTheDocument();
    expect(navigation.push).toHaveBeenLastCalledWith("?sort=oldest", {
      scroll: false,
    });
  });

  it("sorts by title and flips it", () => {
    renderInner();
    fireEvent.click(screen.getByRole("button", { name: "A to Z" }));
    expect(cardTitles()).toEqual(["Alpha", "Bravo", "Charlie"]);
    fireEvent.click(screen.getByRole("button", { name: "A to Z" }));
    expect(cardTitles()).toEqual(["Charlie", "Bravo", "Alpha"]);
    expect(navigation.push).toHaveBeenLastCalledWith("?sort=z-a", {
      scroll: false,
    });
  });
});
