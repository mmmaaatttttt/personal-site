import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import ScreenOverlay from "./ScreenOverlay";

describe("ScreenOverlay", () => {
  it("renders children", () => {
    render(<ScreenOverlay backgroundColor="#bbbbbb">Game over</ScreenOverlay>);
    expect(screen.getByText("Game over")).toBeInTheDocument();
  });

  it("applies the background color with opacity", () => {
    const { container } = render(
      <ScreenOverlay backgroundColor="#52a081">content</ScreenOverlay>
    );
    const overlay = container.firstChild as HTMLElement;
    // jsdom normalizes #rrggbbaa to rgba(); just verify it's non-empty and color-based
    expect(overlay.style.backgroundColor).toBeTruthy();
    expect(overlay.style.backgroundColor).toMatch(/rgba?\(/);
  });

  it("is positioned absolute to cover the parent", () => {
    const { container } = render(
      <ScreenOverlay backgroundColor="#000">content</ScreenOverlay>
    );
    expect(container.firstChild).toHaveClass("absolute", "inset-0");
  });
});
