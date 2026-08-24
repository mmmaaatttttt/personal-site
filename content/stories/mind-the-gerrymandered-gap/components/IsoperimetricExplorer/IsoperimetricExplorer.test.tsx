import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import IsoperimetricExplorer from ".";
import { crossingExists } from "./crossingHelpers";

vi.mock("./crossingHelpers", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./crossingHelpers")>();
  return { ...actual, crossingExists: vi.fn(actual.crossingExists) };
});

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

describe("IsoperimetricExplorer", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      render(<IsoperimetricExplorer />);
    });
    // SVG should be present
    expect(document.querySelector("svg")).toBeTruthy();
  });

  it("shows the initial side count of 3 in the slider label", async () => {
    await act(async () => {
      render(<IsoperimetricExplorer />);
    });
    expect(screen.getByText(/Number of district sides: 3/i)).toBeTruthy();
  });

  it("renders 3 vertices and 3 edges initially", async () => {
    await act(async () => {
      render(<IsoperimetricExplorer />);
    });
    // 3 draggable circles for vertices
    const circles = document.querySelectorAll("svg circle");
    // one circle for the perimeter-matching circle + 3 vertex circles
    expect(circles.length).toBe(4);
    expect(document.querySelectorAll("line").length).toBe(3);
  });

  it("renders the area info table", async () => {
    await act(async () => {
      render(<IsoperimetricExplorer />);
    });
    expect(screen.getByText("Circle Area")).toBeTruthy();
    expect(screen.getByText("Polygon Area")).toBeTruthy();
    expect(screen.getByText("Ratio")).toBeTruthy();
  });

  it("updates vertex count when slider changes", async () => {
    await act(async () => {
      render(<IsoperimetricExplorer />);
    });

    const input = document.querySelector(
      'input[type="range"]',
    ) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { value: "6" } });
    });

    expect(screen.getByText(/Number of district sides: 6/i)).toBeTruthy();
    expect(document.querySelectorAll("line").length).toBe(6);
  });

  it("moves a vertex to the dragged position", async () => {
    await act(async () => {
      render(<IsoperimetricExplorer />);
    });
    const firstVertex = document.querySelectorAll("circle")[1];

    fireEvent.pointerDown(firstVertex, { pointerId: 1 });
    fireEvent.pointerMove(firstVertex, {
      clientX: 250,
      clientY: 200,
      pointerId: 1,
    });
    fireEvent.pointerUp(firstVertex, { pointerId: 1 });

    expect(firstVertex.getAttribute("cx")).toBe("250");
    expect(firstVertex.getAttribute("cy")).toBe("200");
  });

  it("clamps a dragged vertex to the SVG's upper bounds", async () => {
    await act(async () => {
      render(<IsoperimetricExplorer />);
    });
    const firstVertex = document.querySelectorAll("circle")[1];

    fireEvent.pointerDown(firstVertex, { pointerId: 1 });
    fireEvent.pointerMove(firstVertex, {
      clientX: 9999,
      clientY: 9999,
      pointerId: 1,
    });
    fireEvent.pointerUp(firstVertex, { pointerId: 1 });

    expect(firstVertex.getAttribute("cx")).toBe("592");
    expect(firstVertex.getAttribute("cy")).toBe("392");
  });

  it("clamps a dragged vertex to the SVG's lower bounds", async () => {
    await act(async () => {
      render(<IsoperimetricExplorer />);
    });
    const firstVertex = document.querySelectorAll("circle")[1];

    fireEvent.pointerDown(firstVertex, { pointerId: 1 });
    fireEvent.pointerMove(firstVertex, {
      clientX: -9999,
      clientY: -9999,
      pointerId: 1,
    });
    fireEvent.pointerUp(firstVertex, { pointerId: 1 });

    expect(firstVertex.getAttribute("cx")).toBe("8");
    expect(firstVertex.getAttribute("cy")).toBe("8");
  });

  it("ignores a drag that would create a self-intersection", async () => {
    vi.mocked(crossingExists).mockReturnValueOnce(true);
    await act(async () => {
      render(<IsoperimetricExplorer />);
    });
    const firstVertex = document.querySelectorAll("circle")[1];
    const initialCx = firstVertex.getAttribute("cx");
    const initialCy = firstVertex.getAttribute("cy");

    fireEvent.pointerDown(firstVertex, { pointerId: 1 });
    fireEvent.pointerMove(firstVertex, {
      clientX: 300,
      clientY: 200,
      pointerId: 1,
    });
    fireEvent.pointerUp(firstVertex, { pointerId: 1 });

    expect(firstVertex.getAttribute("cx")).toBe(initialCx);
    expect(firstVertex.getAttribute("cy")).toBe(initialCy);
  });
});
