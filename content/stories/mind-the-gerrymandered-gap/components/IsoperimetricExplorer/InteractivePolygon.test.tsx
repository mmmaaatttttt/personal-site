import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import InteractivePolygon from "./InteractivePolygon";

beforeEach(() => {
  SVGSVGElement.prototype.getScreenCTM = vi.fn().mockReturnValue({
    a: 1,
    d: 1,
    e: 0,
    f: 0,
  });
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

const triangle = [
  { x: 50, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
];

function renderPolygon(points = triangle, onDrag = vi.fn()) {
  return render(
    <svg>
      <InteractivePolygon
        points={points}
        fill="green"
        stroke="darkgreen"
        strokeWidth={3}
        circleRadius={8}
        onDrag={onDrag}
      />
    </svg>,
  );
}

describe("InteractivePolygon", () => {
  it("renders a filled polygon", () => {
    const { container } = renderPolygon();
    expect(container.querySelector("polygon")).toBeTruthy();
  });

  it("renders one line per edge", () => {
    const { container } = renderPolygon();
    const lines = container.querySelectorAll("line");
    expect(lines.length).toBe(triangle.length);
  });

  it("renders one draggable circle per vertex", () => {
    const { container } = renderPolygon();
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(triangle.length);
  });

  it("renders correct circle count for a pentagon", () => {
    const pentagon = Array.from({ length: 5 }, (_, i) => ({
      x: 50 + 40 * Math.cos((2 * Math.PI * i) / 5),
      y: 50 + 40 * Math.sin((2 * Math.PI * i) / 5),
    }));
    const { container } = renderPolygon(pentagon);
    expect(container.querySelectorAll("circle").length).toBe(5);
    expect(container.querySelectorAll("line").length).toBe(5);
  });

  it("calls onDrag when a vertex is dragged", () => {
    const onDrag = vi.fn();
    const { container } = renderPolygon(triangle, onDrag);
    const firstCircle = container.querySelector("circle")!;

    fireEvent.pointerDown(firstCircle, { pointerId: 1 });
    fireEvent.pointerMove(firstCircle, {
      clientX: 60,
      clientY: 10,
      pointerId: 1,
    });

    expect(onDrag).toHaveBeenCalledWith(0, { x: 60, y: 10 });
  });
});
