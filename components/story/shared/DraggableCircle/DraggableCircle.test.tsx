import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import DraggableCircle from ".";

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

function renderInSVG(ui: React.ReactElement) {
  const { container } = render(<svg>{ui}</svg>);
  return {
    circle: container.querySelector("circle")!,
  };
}

describe("DraggableCircle", () => {
  it("renders with given position and radius", () => {
    const { circle } = renderInSVG(
      <DraggableCircle id={0} cx={100} cy={200} r={8} onDrag={vi.fn()} />
    );
    expect(circle.getAttribute("cx")).toBe("100");
    expect(circle.getAttribute("cy")).toBe("200");
    expect(circle.getAttribute("r")).toBe("8");
  });

  it("applies optional stroke and strokeWidth", () => {
    const { circle } = renderInSVG(
      <DraggableCircle id={0} cx={0} cy={0} stroke="black" strokeWidth={2} onDrag={vi.fn()} />
    );
    expect(circle.getAttribute("stroke")).toBe("black");
    expect(circle.getAttribute("stroke-width")).toBe("2");
  });

  it("calls onDrag with id and SVG coords during drag", () => {
    const onDrag = vi.fn();
    const { circle } = renderInSVG(
      <DraggableCircle id={3} cx={50} cy={50} onDrag={onDrag} />
    );

    fireEvent.pointerDown(circle, { pointerId: 1 });
    fireEvent.pointerMove(circle, { clientX: 150, clientY: 120, pointerId: 1 });

    // identity CTM: SVG coords equal clientX/Y
    expect(onDrag).toHaveBeenCalledWith(3, { x: 150, y: 120 });
  });

  it("stops firing onDrag after pointerUp", () => {
    const onDrag = vi.fn();
    const { circle } = renderInSVG(
      <DraggableCircle id={0} cx={50} cy={50} onDrag={onDrag} />
    );

    fireEvent.pointerDown(circle, { pointerId: 1 });
    fireEvent.pointerMove(circle, { clientX: 60, clientY: 60, pointerId: 1 });
    fireEvent.pointerUp(circle, { pointerId: 1 });
    fireEvent.pointerMove(circle, { clientX: 70, clientY: 70, pointerId: 1 });

    expect(onDrag).toHaveBeenCalledTimes(1);
  });

  it("does not fire onDrag without a prior pointerDown", () => {
    const onDrag = vi.fn();
    const { circle } = renderInSVG(
      <DraggableCircle id={0} cx={50} cy={50} onDrag={onDrag} />
    );

    fireEvent.pointerMove(circle, { clientX: 60, clientY: 60 });

    expect(onDrag).not.toHaveBeenCalled();
  });
});
