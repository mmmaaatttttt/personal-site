import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import DraggableVertex from "./DraggableVertex";

// jsdom doesn't implement pointer capture or getScreenCTM — provide stubs.
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
  const { container, ...rest } = render(<svg>{ui}</svg>);
  return { container, svg: container.querySelector("svg")!, circle: container.querySelector("circle")!, ...rest };
}

describe("DraggableVertex", () => {
  it("renders a circle with the given position and radius", () => {
    const { circle } = renderInSVG(
      <DraggableVertex id={0} cx={100} cy={200} r={8} fill="green" stroke="black" strokeWidth={2} onDrag={vi.fn()} />
    );
    expect(circle).toBeTruthy();
    expect(circle.getAttribute("cx")).toBe("100");
    expect(circle.getAttribute("cy")).toBe("200");
    expect(circle.getAttribute("r")).toBe("8");
  });

  it("calls onDrag with the correct id and SVG coordinates during a pointer drag", () => {
    const onDrag = vi.fn();
    const { circle } = renderInSVG(
      <DraggableVertex id={2} cx={100} cy={100} r={8} fill="green" stroke="black" strokeWidth={2} onDrag={onDrag} />
    );

    fireEvent.pointerDown(circle, { pointerId: 1 });
    fireEvent.pointerMove(circle, { clientX: 150, clientY: 120, pointerId: 1 });

    expect(onDrag).toHaveBeenCalledWith(2, { x: 150, y: 120 });
  });

  it("stops calling onDrag after pointer up", () => {
    const onDrag = vi.fn();
    const { circle } = renderInSVG(
      <DraggableVertex id={0} cx={50} cy={50} r={8} fill="green" stroke="black" strokeWidth={2} onDrag={onDrag} />
    );

    fireEvent.pointerDown(circle, { pointerId: 1 });
    fireEvent.pointerMove(circle, { clientX: 60, clientY: 60, pointerId: 1 });
    fireEvent.pointerUp(circle, { pointerId: 1 });
    fireEvent.pointerMove(circle, { clientX: 70, clientY: 70, pointerId: 1 });

    expect(onDrag).toHaveBeenCalledTimes(1);
  });

  it("does not call onDrag when pointer moves without prior pointerDown", () => {
    const onDrag = vi.fn();
    const { circle } = renderInSVG(
      <DraggableVertex id={0} cx={50} cy={50} r={8} fill="green" stroke="black" strokeWidth={2} onDrag={onDrag} />
    );

    fireEvent.pointerMove(circle, { clientX: 60, clientY: 60 });

    expect(onDrag).not.toHaveBeenCalled();
  });
});
