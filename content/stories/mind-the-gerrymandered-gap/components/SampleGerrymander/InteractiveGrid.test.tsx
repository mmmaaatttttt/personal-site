import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getInitialSegments } from "./constants";
import InteractiveGrid from "./InteractiveGrid";

beforeEach(() => {
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
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
});
