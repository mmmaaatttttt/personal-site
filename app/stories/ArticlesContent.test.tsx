import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ArticleMeta } from "@/utils/content";

const mockSelectHandlers = vi.hoisted(() => ({
  year: null as ((v: unknown) => void) | null,
  tags: null as ((v: unknown) => void) | null,
}));

vi.mock("react-select", () => ({
  default: (props: {
    placeholder?: string;
    onChange?: (v: unknown) => void;
    styles?: Record<string, (base: object, state?: object) => object>;
  }) => {
    if (props.placeholder === "Filter by year...") {
      mockSelectHandlers.year = props.onChange ?? null;
    } else if (props.placeholder === "Filter by tag...") {
      mockSelectHandlers.tags = props.onChange ?? null;
    }
    // Exercise all selectStyles callbacks so their branches are covered
    if (props.styles) {
      props.styles.control?.({}, { isFocused: false });
      props.styles.control?.({}, { isFocused: true });
      props.styles.option?.({}, { isSelected: false, isFocused: false });
      props.styles.option?.({}, { isSelected: false, isFocused: true });
      props.styles.option?.({}, { isSelected: true, isFocused: false });
      props.styles.multiValue?.({});
      props.styles.multiValueLabel?.({});
      props.styles.multiValueRemove?.({});
      props.styles.menu?.({});
    }
    return <div data-testid={`select-${props.placeholder}`} />;
  },
}));

vi.mock("@/components/layout/StoryCard", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="story-card">{title}</div>
  ),
}));

import ArticlesContent from "./ArticlesContent";

const makeArticle = (slug: string, year: number, tags: string[]): ArticleMeta =>
  ({
    slug,
    title: `Story ${slug}`,
    caption: "A caption",
    // Use mid-year date to avoid UTC-offset boundary issues with getFullYear()
    date: `${year}-06-15`,
    featured_image: "/img.jpg",
    tags,
    timeToRead: 5,
  }) as unknown as ArticleMeta;

const articles: ArticleMeta[] = [
  makeArticle("story-a", 2024, ["math", "games"]),
  makeArticle("story-b", 2023, ["equity"]),
];

describe("ArticlesContent", () => {
  it("renders all articles by default", () => {
    render(
      <ArticlesContent
        articles={articles}
        years={[2024, 2023]}
        tags={["math", "games", "equity"]}
      />,
    );
    expect(screen.getByText("Story story-a")).toBeInTheDocument();
    expect(screen.getByText("Story story-b")).toBeInTheDocument();
  });

  it("filters articles when a year is selected", () => {
    render(
      <ArticlesContent
        articles={articles}
        years={[2024, 2023]}
        tags={["math"]}
      />,
    );
    act(() => {
      mockSelectHandlers.year?.({ value: 2024, label: "2024" });
    });
    expect(screen.getByText("Story story-a")).toBeInTheDocument();
    expect(screen.queryByText("Story story-b")).not.toBeInTheDocument();
  });

  it("clears year filter when null is passed", () => {
    render(
      <ArticlesContent
        articles={articles}
        years={[2024, 2023]}
        tags={["math"]}
      />,
    );
    act(() => {
      mockSelectHandlers.year?.({ value: 2024, label: "2024" });
    });
    act(() => {
      mockSelectHandlers.year?.(null);
    });
    expect(screen.getByText("Story story-a")).toBeInTheDocument();
    expect(screen.getByText("Story story-b")).toBeInTheDocument();
  });

  it("filters articles when tags are selected", () => {
    render(
      <ArticlesContent
        articles={articles}
        years={[2024, 2023]}
        tags={["math"]}
      />,
    );
    act(() => {
      mockSelectHandlers.tags?.([{ value: "math", label: "math" }]);
    });
    expect(screen.getByText("Story story-a")).toBeInTheDocument();
    expect(screen.queryByText("Story story-b")).not.toBeInTheDocument();
  });

  it("shows empty message when no articles match filters", () => {
    render(
      <ArticlesContent
        articles={articles}
        years={[2024, 2023]}
        tags={["math"]}
      />,
    );
    act(() => {
      mockSelectHandlers.tags?.([
        { value: "nonexistent-tag", label: "nonexistent-tag" },
      ]);
    });
    expect(
      screen.getByText(/no stories match your filters/i),
    ).toBeInTheDocument();
  });

  it("clears tag filter when null is passed", () => {
    render(
      <ArticlesContent
        articles={articles}
        years={[2024, 2023]}
        tags={["math"]}
      />,
    );
    act(() => {
      mockSelectHandlers.tags?.([{ value: "math", label: "math" }]);
    });
    act(() => {
      mockSelectHandlers.tags?.(null);
    });
    expect(screen.getByText("Story story-a")).toBeInTheDocument();
    expect(screen.getByText("Story story-b")).toBeInTheDocument();
  });
});
