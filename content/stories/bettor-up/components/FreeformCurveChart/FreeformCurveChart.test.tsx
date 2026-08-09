import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import COLORS from "@/utils/styles";
import FreeformCurveChart from ".";

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

afterEach(() => {
  vi.restoreAllMocks();
});

function getCurvePath(container: HTMLElement) {
  return container.querySelector(
    `path[stroke="${COLORS.BLUE}"]`,
  ) as SVGPathElement;
}

function getDrawSurface(container: HTMLElement) {
  return container.querySelector('rect[fill="transparent"]') as SVGRectElement;
}

describe("FreeformCurveChart", () => {
  it("starts as a flat line with exactly one honest crossing at p = 0.5", () => {
    const { container } = render(<FreeformCurveChart />);
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(1);
    expect(circles[0]).toHaveAttribute("fill", COLORS.DARK_GREEN);
  });

  it("updates the drawn curve while dragging inside the plot", () => {
    const { container } = render(<FreeformCurveChart />);
    const before = getCurvePath(container).getAttribute("d");
    const surface = getDrawSurface(container);

    fireEvent.pointerDown(surface, { clientX: 142, clientY: 71, pointerId: 1 });
    fireEvent.pointerMove(surface, { clientX: 388, clientY: 71, pointerId: 1 });

    expect(getCurvePath(container).getAttribute("d")).not.toBe(before);
  });

  it("ignores pointer movement outside the [0,1] domain", () => {
    const { container } = render(<FreeformCurveChart />);
    const before = getCurvePath(container).getAttribute("d");
    const surface = getDrawSurface(container);

    fireEvent.pointerDown(surface, { clientX: 142, clientY: 71, pointerId: 1 });
    fireEvent.pointerMove(surface, {
      clientX: 5000,
      clientY: 71,
      pointerId: 1,
    });

    expect(getCurvePath(container).getAttribute("d")).toBe(before);
  });

  it("stops painting after pointer up", () => {
    const { container } = render(<FreeformCurveChart />);
    const surface = getDrawSurface(container);

    fireEvent.pointerDown(surface, { clientX: 142, clientY: 71, pointerId: 1 });
    fireEvent.pointerUp(surface, { pointerId: 1 });
    const afterUp = getCurvePath(container).getAttribute("d");

    fireEvent.pointerMove(surface, {
      clientX: 388,
      clientY: 200,
      pointerId: 1,
    });

    expect(getCurvePath(container).getAttribute("d")).toBe(afterUp);
  });

  it("restores the flat starting line when Reset is clicked", () => {
    const { container } = render(<FreeformCurveChart />);
    const initial = getCurvePath(container).getAttribute("d");
    const surface = getDrawSurface(container);

    fireEvent.pointerDown(surface, { clientX: 142, clientY: 71, pointerId: 1 });
    fireEvent.pointerMove(surface, { clientX: 388, clientY: 71, pointerId: 1 });
    expect(getCurvePath(container).getAttribute("d")).not.toBe(initial);

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(getCurvePath(container).getAttribute("d")).toBe(initial);
    expect(container.querySelectorAll("circle")).toHaveLength(1);
  });
});
