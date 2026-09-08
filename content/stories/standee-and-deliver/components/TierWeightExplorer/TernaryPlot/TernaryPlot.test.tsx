import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TernaryPlot from ".";

beforeEach(() => {
  SVGSVGElement.prototype.getScreenCTM = vi
    .fn()
    .mockReturnValue({ a: 1, d: 1, e: 0, f: 0 });
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TernaryPlot", () => {
  it("renders the triangle and its vertex labels with live percentages", () => {
    render(
      <TernaryPlot
        value={{ black: 1 / 3, silver: 1 / 3, gold: 1 / 3 }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Black: 33.3%")).toBeInTheDocument();
    expect(screen.getByText("Silver: 33.3%")).toBeInTheDocument();
    expect(screen.getByText("Gold: 33.3%")).toBeInTheDocument();
  });

  it("updates the vertex percentages as the value prop changes", () => {
    render(
      <TernaryPlot
        value={{ black: 0.5, silver: 0.3, gold: 0.2 }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Black: 50.0%")).toBeInTheDocument();
    expect(screen.getByText("Silver: 30.0%")).toBeInTheDocument();
    expect(screen.getByText("Gold: 20.0%")).toBeInTheDocument();
  });

  it("does not render a reference marker when none is provided", () => {
    render(
      <TernaryPlot
        value={{ black: 1 / 3, silver: 1 / 3, gold: 1 / 3 }}
        onChange={vi.fn()}
      />,
    );
    expect(document.querySelectorAll("circle")).toHaveLength(1);
    expect(document.querySelectorAll("line")).toHaveLength(2);
  });

  it("renders a reference marker as an X when a reference value is provided", () => {
    render(
      <TernaryPlot
        value={{ black: 1 / 3, silver: 1 / 3, gold: 1 / 3 }}
        onChange={vi.fn()}
        referenceValue={{ black: 0.465, silver: 0.45, gold: 0.085 }}
      />,
    );
    expect(document.querySelectorAll("circle")).toHaveLength(1);
    expect(document.querySelectorAll("line")).toHaveLength(4);
  });

  it("reports normalized tier weights when the point is dragged", () => {
    const handleChange = vi.fn();
    render(
      <TernaryPlot
        value={{ black: 1 / 3, silver: 1 / 3, gold: 1 / 3 }}
        onChange={handleChange}
      />,
    );
    const point = document.querySelector(
      "circle[fill='#ff3c23']",
    ) as SVGCircleElement;
    fireEvent.pointerDown(point);
    fireEvent.pointerMove(point, { clientX: 140, clientY: 28 });

    expect(handleChange).toHaveBeenCalled();
    const weights = handleChange.mock.calls[0][0];
    expect(weights.black + weights.silver + weights.gold).toBeCloseTo(1);
  });

  it("snaps onto the reference value when dragged nearby", () => {
    const handleChange = vi.fn();
    render(
      <TernaryPlot
        value={{ black: 1 / 3, silver: 1 / 3, gold: 1 / 3 }}
        onChange={handleChange}
        referenceValue={{ black: 0.465, silver: 0.45, gold: 0.085 }}
      />,
    );
    const point = document.querySelector(
      "circle[fill='#ff3c23']",
    ) as SVGCircleElement;
    fireEvent.pointerDown(point);
    fireEvent.pointerMove(point, { clientX: 138, clientY: 196 });

    expect(handleChange).toHaveBeenCalledWith({
      black: 0.465,
      silver: 0.45,
      gold: 0.085,
    });
  });
});
