import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ArticleMeta } from "@/utils/content";
import BubblePreview from "./BubblePreview";

const article = {
  title: "Coin Operator",
  date: "July 2026",
  timeToRead: 12,
  caption: "A caption",
} as ArticleMeta;

describe("BubblePreview", () => {
  it("shows the story's title, date, and caption at the given position", () => {
    const { container } = render(
      <BubblePreview article={article} visible left={12} top={34} />,
    );
    expect(screen.getByText("Coin Operator")).toBeInTheDocument();
    expect(screen.getByText("July 2026 - 12 minute read")).toBeInTheDocument();
    expect(screen.getByText("A caption")).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle({ left: "12px", top: "34px" });
    expect(container.firstChild).toHaveClass("opacity-100");
  });

  it("omits the reading time when it is unknown", () => {
    render(
      <BubblePreview
        article={{ ...article, timeToRead: 0 }}
        visible
        left={0}
        top={0}
      />,
    );
    expect(screen.getByText("July 2026")).toBeInTheDocument();
  });

  it("fades out while keeping its last story", () => {
    const { container } = render(
      <BubblePreview article={article} visible={false} left={0} top={0} />,
    );
    expect(container.firstChild).toHaveClass("opacity-0");
    expect(screen.getByText("Coin Operator")).toBeInTheDocument();
  });

  it("renders empty before any story is previewed", () => {
    const { container } = render(
      <BubblePreview article={undefined} visible={false} left={0} top={0} />,
    );
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
