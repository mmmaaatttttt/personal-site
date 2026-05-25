import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BlueskyIcon from "./BlueskyIcon";

describe("BlueskyIcon", () => {
  it("renders an SVG with default size and strokeWidth", () => {
    const { container } = render(<BlueskyIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
    expect(svg).toHaveAttribute("stroke-width", "1.5");
  });

  it("renders with custom size and strokeWidth", () => {
    const { container } = render(<BlueskyIcon size={32} strokeWidth={2} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
    expect(svg).toHaveAttribute("stroke-width", "2");
  });

  it("has a title element for accessibility", () => {
    const { container } = render(<BlueskyIcon />);
    const title = container.querySelector("title");
    expect(title).toHaveTextContent("Bluesky");
  });

  it("spreads additional SVG props onto the element", () => {
    const { container } = render(<BlueskyIcon className="icon-test" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("icon-test");
  });
});
