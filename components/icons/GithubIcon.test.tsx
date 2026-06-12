import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GithubIcon from "./GithubIcon";

describe("GithubIcon", () => {
  it("renders an SVG with default size and strokeWidth", () => {
    const { container } = render(<GithubIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
    expect(svg).toHaveAttribute("stroke-width", "1.5");
  });

  it("renders with custom size and strokeWidth", () => {
    const { container } = render(<GithubIcon size={32} strokeWidth={2} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
    expect(svg).toHaveAttribute("stroke-width", "2");
  });

  it("has a title element for accessibility", () => {
    const { container } = render(<GithubIcon />);
    const title = container.querySelector("title");
    expect(title).toHaveTextContent("GitHub");
  });

  it("spreads additional SVG props onto the element", () => {
    const { container } = render(<GithubIcon className="icon-test" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("icon-test");
  });
});
