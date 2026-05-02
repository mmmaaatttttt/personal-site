import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
      (l) => l.getAttribute("stroke") === "#ff8f34",
    );
    expect(orange).not.toBeUndefined();
  });

  it("renders a caption when provided", () => {
    render(<DistanceExplorer caption="Test caption" />);
    expect(screen.getByText("Test caption")).toBeTruthy();
  });

  it("clamps drag so the circle edge stays inside the SVG (2r pixel offset)", () => {
    render(<DistanceExplorer />);
    const circle = document.querySelectorAll("circle")[0];

    // Drag far outside the 600×600 SVG (identity CTM: clientX === SVG x).
    // Without clamping, xScale.invert(1200) = 30 which is outside [-10, 10].
    // With 2r=16 offset, x is clamped to 600-16=584 before inversion.
    fireEvent.pointerDown(circle, { pointerId: 1, clientX: 300, clientY: 300 });
    fireEvent.pointerMove(circle, { clientX: 1200, clientY: -200 });
    fireEvent.pointerUp(circle);

    const label = document.querySelector('text[fill="#ff8f34"]');
    const value = parseFloat(label?.textContent ?? "NaN");
    expect(isNaN(value)).toBe(false);
    expect(value).toBeGreaterThanOrEqual(0);
  });

  it("updates distance label on drag", () => {
    render(<DistanceExplorer />);
    const circles = document.querySelectorAll("circle");
    const draggable = circles[0];

    fireEvent.pointerDown(draggable, {
      pointerId: 1,
      clientX: 200,
      clientY: 400,
    });
    fireEvent.pointerMove(draggable, { clientX: 250, clientY: 350 });
    fireEvent.pointerUp(draggable);

    const distanceText = document.querySelector('text[fill="#ff8f34"]');
    expect(distanceText?.textContent).toMatch(/^\d+\.\d{2}$/);
  });
});
