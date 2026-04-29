import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DistanceExplorer from ".";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

beforeEach(() => {
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  SVGSVGElement.prototype.getScreenCTM = vi.fn().mockReturnValue({
    a: 1,
    d: 1,
    e: 0,
    f: 0,
  });
});

describe("DistanceExplorer", () => {
  it("renders without crashing", () => {
    render(<DistanceExplorer />);
    const circles = document.querySelectorAll("circle");
    expect(circles.length).toBeGreaterThanOrEqual(2);
  });

  it("renders the distance label with orange fill", () => {
    render(<DistanceExplorer />);
    // The distance label is a <text> with fill set to COLORS.ORANGE
    const distanceText = document.querySelector('text[fill="#ff8f34"]');
    expect(distanceText).not.toBeNull();
    expect(distanceText?.textContent).toMatch(/^\d+\.\d{2}$/);
  });

  it("renders the orange connecting line", () => {
    render(<DistanceExplorer />);
    const lines = document.querySelectorAll("line");
    const orange = Array.from(lines).find(
      (l) => l.getAttribute("stroke") === "#ff8f34"
    );
    expect(orange).not.toBeUndefined();
  });

  it("renders a caption when provided", () => {
    render(<DistanceExplorer caption="Test caption" />);
    expect(screen.getByText("Test caption")).toBeTruthy();
  });

  it("updates distance label on drag", () => {
    render(<DistanceExplorer />);
    const circles = document.querySelectorAll("circle");
    const draggable = circles[0];

    fireEvent.pointerDown(draggable, { pointerId: 1, clientX: 200, clientY: 400 });
    fireEvent.pointerMove(draggable, { clientX: 250, clientY: 350 });
    fireEvent.pointerUp(draggable);

    const distanceText = document.querySelector('text[fill="#ff8f34"]');
    expect(distanceText?.textContent).toMatch(/^\d+\.\d{2}$/);
  });
});
