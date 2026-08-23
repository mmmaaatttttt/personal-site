import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getInitialSegments } from "./constants";
import InteractiveGrid from "./InteractiveGrid";

beforeEach(() => {
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  document.elementFromPoint = vi.fn();

  if (typeof globalThis.SVGLineElement === "undefined") {
    (globalThis as unknown as { SVGLineElement: unknown }).SVGLineElement =
      SVGElement;
  }
});

afterEach(() => {
  vi.restoreAllMocks();
});

const defaultProps = {
  width: 450,
  height: 300,
  paddingX: 33.75,
  paddingY: 22.5,
  strokeWidth: 6,
  rowCount: 6,
  colCount: 9,
  segments: getInitialSegments(6, 9),
  onSegmentUpdate: vi.fn(),
};

describe("InteractiveGrid", () => {
  it("renders without crashing", () => {
    render(
      <svg role="img" aria-label="test">
        {<InteractiveGrid {...defaultProps} />}
      </svg>,
    );
  });

  it("renders the correct number of interactive segment lines", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <InteractiveGrid {...defaultProps} />
      </svg>,
    );
    // For rowCount=6, colCount=9:
    // Even rows (0,2,4,6,8,10): 6 rows × (colCount-1=8) = 48 vertical segments
    // Odd rows (1,3,5,7,9): 5 rows × colCount=9 = 45 horizontal segments
    // Total = 93, plus the border rect = 94 elements
    const lines = container.querySelectorAll("line");
    expect(lines).toHaveLength(93);
  });

  it("lines have data-row and data-col attributes for hit-testing", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <InteractiveGrid {...defaultProps} />
      </svg>,
    );
    const lines = container.querySelectorAll("line");
    lines.forEach((line) => {
      expect(line.getAttribute("data-row")).not.toBeNull();
      expect(line.getAttribute("data-col")).not.toBeNull();
    });
  });

  it("calls onSegmentUpdate with the toggled status on pointerDown", () => {
    const onSegmentUpdate = vi.fn();
    const { container } = render(
      <svg role="img" aria-label="test">
        <InteractiveGrid {...defaultProps} onSegmentUpdate={onSegmentUpdate} />
      </svg>,
    );
    const lines = container.querySelectorAll("line");
    fireEvent.pointerDown(lines[0]);
    expect(onSegmentUpdate).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      true,
    );
  });

  it("shows already-on segments differently (isOn = true)", () => {
    const segments = getInitialSegments(6, 9);
    segments[0][0] = true;
    const { container } = render(
      <svg role="img" aria-label="test">
        <InteractiveGrid {...defaultProps} segments={segments} />
      </svg>,
    );
    const lines = container.querySelectorAll("line");
    // The first on segment should have DARK_GRAY stroke
    const onSegment = Array.from(lines).find(
      (l) => l.getAttribute("stroke") !== "#ffffff",
    );
    expect(onSegment).toBeTruthy();
  });

  describe("touchAction effect", () => {
    it("sets and restores touchAction when mounted inside an SVG", () => {
      const { unmount, container } = render(
        <svg role="img" aria-label="test">
          <InteractiveGrid {...defaultProps} />
        </svg>,
      );
      const svg = container.querySelector("svg") as SVGSVGElement;
      expect(svg.style.touchAction).toBe("none");
      unmount();
      expect(svg.style.touchAction).toBe("");
    });

    it("does nothing when rendered without an owning SVG", () => {
      expect(() => render(<InteractiveGrid {...defaultProps} />)).not.toThrow();
    });
  });

  describe("drag across cells (container pointer move)", () => {
    it("updates the segment under the pointer while dragging", () => {
      const onSegmentUpdate = vi.fn();
      const { container } = render(
        <svg role="img" aria-label="test">
          <InteractiveGrid
            {...defaultProps}
            onSegmentUpdate={onSegmentUpdate}
          />
        </svg>,
      );
      const g = container.querySelector("g") as SVGGElement;
      const lines = container.querySelectorAll("line");
      fireEvent.pointerDown(lines[0]);
      onSegmentUpdate.mockClear();

      (document.elementFromPoint as ReturnType<typeof vi.fn>).mockReturnValue(
        lines[1],
      );
      fireEvent.pointerMove(g, { clientX: 10, clientY: 10 });

      const row = Number(lines[1].getAttribute("data-row"));
      const col = Number(lines[1].getAttribute("data-col"));
      expect(onSegmentUpdate).toHaveBeenCalledWith(row, col, true);
    });

    it("does nothing while not dragging", () => {
      const onSegmentUpdate = vi.fn();
      const { container } = render(
        <svg role="img" aria-label="test">
          <InteractiveGrid
            {...defaultProps}
            onSegmentUpdate={onSegmentUpdate}
          />
        </svg>,
      );
      const g = container.querySelector("g") as SVGGElement;
      const lines = container.querySelectorAll("line");

      (document.elementFromPoint as ReturnType<typeof vi.fn>).mockReturnValue(
        lines[0],
      );
      fireEvent.pointerMove(g, { clientX: 10, clientY: 10 });

      expect(onSegmentUpdate).not.toHaveBeenCalled();
    });

    it("does nothing when the pointer isn't over a line", () => {
      const onSegmentUpdate = vi.fn();
      const { container } = render(
        <svg role="img" aria-label="test">
          <InteractiveGrid
            {...defaultProps}
            onSegmentUpdate={onSegmentUpdate}
          />
        </svg>,
      );
      const g = container.querySelector("g") as SVGGElement;
      const lines = container.querySelectorAll("line");
      fireEvent.pointerDown(lines[0]);
      onSegmentUpdate.mockClear();

      (document.elementFromPoint as ReturnType<typeof vi.fn>).mockReturnValue(
        document.body,
      );
      fireEvent.pointerMove(g, { clientX: 10, clientY: 10 });

      expect(onSegmentUpdate).not.toHaveBeenCalled();
    });

    it("does nothing when the hit line has no row/col data", () => {
      const onSegmentUpdate = vi.fn();
      const { container } = render(
        <svg role="img" aria-label="test">
          <InteractiveGrid
            {...defaultProps}
            onSegmentUpdate={onSegmentUpdate}
          />
        </svg>,
      );
      const g = container.querySelector("g") as SVGGElement;
      const lines = container.querySelectorAll("line");
      fireEvent.pointerDown(lines[0]);
      onSegmentUpdate.mockClear();

      const bareLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      (document.elementFromPoint as ReturnType<typeof vi.fn>).mockReturnValue(
        bareLine,
      );
      fireEvent.pointerMove(g, { clientX: 10, clientY: 10 });

      expect(onSegmentUpdate).not.toHaveBeenCalled();
    });

    it("ends the drag on pointerUp and pointerCancel", () => {
      const onSegmentUpdate = vi.fn();
      const { container } = render(
        <svg role="img" aria-label="test">
          <InteractiveGrid
            {...defaultProps}
            onSegmentUpdate={onSegmentUpdate}
          />
        </svg>,
      );
      const g = container.querySelector("g") as SVGGElement;
      const lines = container.querySelectorAll("line");
      fireEvent.pointerDown(lines[0]);
      fireEvent.pointerUp(g);
      onSegmentUpdate.mockClear();

      (document.elementFromPoint as ReturnType<typeof vi.fn>).mockReturnValue(
        lines[1],
      );
      fireEvent.pointerMove(g, { clientX: 10, clientY: 10 });
      expect(onSegmentUpdate).not.toHaveBeenCalled();

      fireEvent.pointerDown(lines[0]);
      fireEvent.pointerCancel(g);
      onSegmentUpdate.mockClear();
      fireEvent.pointerMove(g, { clientX: 10, clientY: 10 });
      expect(onSegmentUpdate).not.toHaveBeenCalled();
    });
  });

  describe("hover state", () => {
    it("highlights a segment on pointer hover and clears it on leave", () => {
      const { container } = render(
        <svg role="img" aria-label="test">
          <InteractiveGrid {...defaultProps} />
        </svg>,
      );
      const lines = container.querySelectorAll("line");
      const strokeBefore = lines[10].getAttribute("stroke");

      fireEvent.pointerMove(lines[10]);
      // Hovering reorders segmentData, so re-query by row/col.
      const hoveredLine = Array.from(container.querySelectorAll("line")).find(
        (l) =>
          l.getAttribute("data-row") === lines[10].getAttribute("data-row") &&
          l.getAttribute("data-col") === lines[10].getAttribute("data-col"),
      );
      expect(hoveredLine?.getAttribute("stroke")).not.toBe(strokeBefore);

      // Covers the "already hovered" skip branch.
      fireEvent.pointerMove(hoveredLine as Element);

      fireEvent.pointerLeave(hoveredLine as Element);
      const afterLeave = Array.from(container.querySelectorAll("line")).find(
        (l) =>
          l.getAttribute("data-row") === lines[10].getAttribute("data-row") &&
          l.getAttribute("data-col") === lines[10].getAttribute("data-col"),
      );
      expect(afterLeave?.getAttribute("stroke")).toBe(strokeBefore);
    });

    it("highlights an already-on segment differently when hovered", () => {
      const segments = getInitialSegments(6, 9);
      segments[0][0] = true;
      const { container } = render(
        <svg role="img" aria-label="test">
          <InteractiveGrid {...defaultProps} segments={segments} />
        </svg>,
      );
      const onLine = Array.from(container.querySelectorAll("line")).find(
        (l) =>
          l.getAttribute("data-row") === "0" &&
          l.getAttribute("data-col") === "0",
      ) as SVGLineElement;
      const strokeBefore = onLine.getAttribute("stroke");
      fireEvent.pointerMove(onLine);
      const hovered = Array.from(container.querySelectorAll("line")).find(
        (l) =>
          l.getAttribute("data-row") === "0" &&
          l.getAttribute("data-col") === "0",
      );
      expect(hovered?.getAttribute("stroke")).not.toBe(strokeBefore);
    });

    it("highlights a segment on focus and clears it on blur", () => {
      const { container } = render(
        <svg role="img" aria-label="test">
          <InteractiveGrid {...defaultProps} />
        </svg>,
      );
      const lines = container.querySelectorAll("line");
      const strokeBefore = lines[5].getAttribute("stroke");

      fireEvent.focus(lines[5]);
      const focused = Array.from(container.querySelectorAll("line")).find(
        (l) =>
          l.getAttribute("data-row") === lines[5].getAttribute("data-row") &&
          l.getAttribute("data-col") === lines[5].getAttribute("data-col"),
      );
      expect(focused?.getAttribute("stroke")).not.toBe(strokeBefore);

      fireEvent.blur(focused as Element);
      const afterBlur = Array.from(container.querySelectorAll("line")).find(
        (l) =>
          l.getAttribute("data-row") === lines[5].getAttribute("data-row") &&
          l.getAttribute("data-col") === lines[5].getAttribute("data-col"),
      );
      expect(afterBlur?.getAttribute("stroke")).toBe(strokeBefore);
    });

    it("does not show hover styling while dragging", () => {
      const { container } = render(
        <svg role="img" aria-label="test">
          <InteractiveGrid {...defaultProps} />
        </svg>,
      );
      const lines = container.querySelectorAll("line");
      fireEvent.pointerDown(lines[0]);
      const strokeBefore = lines[1].getAttribute("stroke");
      fireEvent.pointerMove(lines[1]);
      expect(lines[1].getAttribute("stroke")).toBe(strokeBefore);
    });
  });

  describe("keyboard interaction", () => {
    it("toggles the segment on Enter", () => {
      const onSegmentUpdate = vi.fn();
      const { container } = render(
        <svg role="img" aria-label="test">
          <InteractiveGrid
            {...defaultProps}
            onSegmentUpdate={onSegmentUpdate}
          />
        </svg>,
      );
      const lines = container.querySelectorAll("line");
      fireEvent.keyDown(lines[0], { key: "Enter" });
      expect(onSegmentUpdate).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        true,
      );
    });

    it("toggles the segment on Space", () => {
      const onSegmentUpdate = vi.fn();
      const { container } = render(
        <svg role="img" aria-label="test">
          <InteractiveGrid
            {...defaultProps}
            onSegmentUpdate={onSegmentUpdate}
          />
        </svg>,
      );
      const lines = container.querySelectorAll("line");
      fireEvent.keyDown(lines[0], { key: " " });
      expect(onSegmentUpdate).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        true,
      );
    });

    it("ignores other keys", () => {
      const onSegmentUpdate = vi.fn();
      const { container } = render(
        <svg role="img" aria-label="test">
          <InteractiveGrid
            {...defaultProps}
            onSegmentUpdate={onSegmentUpdate}
          />
        </svg>,
      );
      const lines = container.querySelectorAll("line");
      fireEvent.keyDown(lines[0], { key: "a" });
      expect(onSegmentUpdate).not.toHaveBeenCalled();
    });
  });
});
