import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import NarrowContainer from ".";

describe("NarrowContainer Component", () => {
  it("renders children correctly", () => {
    render(
      <NarrowContainer>
        <div data-testid="child">Child Content</div>
      </NarrowContainer>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("applies custom width and margin through style attribute", () => {
    render(
      <NarrowContainer width="60%" margin="20px auto">
        Content
      </NarrowContainer>,
    );
    const container = screen.getByText("Content");
    expect(container).toHaveStyle({ width: "60%", margin: "20px auto" });
  });

  it("applies center class when center prop is true", () => {
    render(<NarrowContainer center={true}>Content</NarrowContainer>);
    expect(screen.getByText("Content")).toHaveClass("text-center");
  });

  it("applies correct breakpoint classes", () => {
    const { rerender } = render(
      <NarrowContainer fullWidthAt="md">Content</NarrowContainer>,
    );
    expect(screen.getByText("Content")).toHaveClass("max-md:w-full");

    rerender(<NarrowContainer fullWidthAt="lg">Content</NarrowContainer>);
    expect(screen.getByText("Content")).toHaveClass("max-lg:w-full");
  });
});
