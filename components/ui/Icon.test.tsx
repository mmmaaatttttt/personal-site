import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Loader, Search } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Icon } from "./Icon";

describe("Icon", () => {
  it("renders an svg element", () => {
    const { container } = render(<Icon icon={Search} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies shrink-0 class by default", () => {
    const { container } = render(<Icon icon={Search} />);
    expect(container.querySelector("svg")).toHaveClass("shrink-0");
  });

  it("applies animate-spin when spin=true", () => {
    const { container } = render(<Icon icon={Loader} spin />);
    expect(container.querySelector("svg")).toHaveClass("animate-spin");
  });

  it("does not apply animate-spin when spin=false", () => {
    const { container } = render(<Icon icon={Search} spin={false} />);
    expect(container.querySelector("svg")).not.toHaveClass("animate-spin");
  });

  it("merges additional className", () => {
    const { container } = render(
      <Icon icon={Search} className="text-red-500" />,
    );
    expect(container.querySelector("svg")).toHaveClass("text-red-500");
  });

  it("forwards size prop as width and height attributes", () => {
    const { container } = render(<Icon icon={Search} size={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("forwards extra svg props", () => {
    const { container } = render(
      <Icon icon={Search} aria-label="search icon" />,
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-label",
      "search icon",
    );
  });
});
