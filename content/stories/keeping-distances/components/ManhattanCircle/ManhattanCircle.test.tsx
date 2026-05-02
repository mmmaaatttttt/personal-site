import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ManhattanCircle from ".";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("ManhattanCircle", () => {
  it("renders without crashing", () => {
    render(<ManhattanCircle />);
    const circles = document.querySelectorAll("circle");
    // at radius=1 we get 4 circle points + 1 red center
    expect(circles.length).toBe(5);
  });

  it("renders the red center dot", () => {
    render(<ManhattanCircle />);
    const circles = document.querySelectorAll("circle");
    const red = Array.from(circles).find(
      (c) => c.getAttribute("fill") === "#ff3c23",
    );
    expect(red).not.toBeUndefined();
  });

  it("renders a caption when provided", () => {
    render(<ManhattanCircle caption="Test caption" />);
    expect(screen.getByText("Test caption")).toBeTruthy();
  });

  it("shows slider for radius", () => {
    render(<ManhattanCircle />);
    const slider = document.querySelector('input[type="range"]');
    expect(slider).not.toBeNull();
  });

  it("increases circle point count as radius grows", () => {
    render(<ManhattanCircle />);
    const slider = document.querySelector(
      'input[type="range"]',
    ) as HTMLInputElement;
    // radius=1 → 4 circle points + 1 center = 5
    expect(document.querySelectorAll("circle").length).toBe(5);

    // change to radius=2 → 8 circle points + 1 center = 9
    fireEvent.change(slider, { target: { value: "2" } });
    expect(document.querySelectorAll("circle").length).toBe(9);
  });
});
