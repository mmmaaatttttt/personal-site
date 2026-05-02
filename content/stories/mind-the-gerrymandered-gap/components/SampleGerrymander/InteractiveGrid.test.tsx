import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getInitialSegments } from "./constants";
import InteractiveGrid from "./InteractiveGrid";

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
    render(<svg>{<InteractiveGrid {...defaultProps} />}</svg>);
  });

  it("renders the correct number of interactive segment lines", () => {
    const { container } = render(
      <svg>
        <InteractiveGrid {...defaultProps} />
      </svg>
    );
    // For rowCount=6, colCount=9:
    // Even rows (0,2,4,6,8,10): 6 rows × (colCount-1=8) = 48 vertical segments
    // Odd rows (1,3,5,7,9): 5 rows × colCount=9 = 45 horizontal segments
    // Total = 93, plus the border rect = 94 elements
    const lines = container.querySelectorAll("line");
    expect(lines).toHaveLength(93);
  });

  it("calls onSegmentUpdate with the toggled status on mousedown", () => {
    const onSegmentUpdate = vi.fn();
    const { container } = render(
      <svg>
        <InteractiveGrid {...defaultProps} onSegmentUpdate={onSegmentUpdate} />
      </svg>
    );
    const lines = container.querySelectorAll("line");
    fireEvent.mouseDown(lines[0]);
    expect(onSegmentUpdate).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      true
    );
  });

  it("calls onSegmentUpdate with null-like value on mouseenter when not dragging", () => {
    const onSegmentUpdate = vi.fn();
    const { container } = render(
      <svg>
        <InteractiveGrid {...defaultProps} onSegmentUpdate={onSegmentUpdate} />
      </svg>
    );
    const lines = container.querySelectorAll("line");
    // mouseenter without prior mousedown — activeStatus is null
    fireEvent.mouseEnter(lines[0]);
    expect(onSegmentUpdate).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      null
    );
  });

  it("shows already-on segments differently (isOn = true)", () => {
    const segments = getInitialSegments(6, 9);
    segments[0][0] = true;
    const { container } = render(
      <svg>
        <InteractiveGrid {...defaultProps} segments={segments} />
      </svg>
    );
    const lines = container.querySelectorAll("line");
    // The first on segment should have DARK_GRAY stroke
    const onSegment = Array.from(lines).find(
      (l) => l.getAttribute("stroke") !== "#ffffff"
    );
    expect(onSegment).toBeTruthy();
  });

  it("clears drag state on window mouseup", () => {
    const onSegmentUpdate = vi.fn();
    const { container } = render(
      <svg>
        <InteractiveGrid {...defaultProps} onSegmentUpdate={onSegmentUpdate} />
      </svg>
    );
    const lines = container.querySelectorAll("line");
    fireEvent.mouseDown(lines[0]);
    fireEvent.mouseUp(window);
    // After mouseup, entering another segment should pass null as activeStatus
    onSegmentUpdate.mockClear();
    fireEvent.mouseEnter(lines[1]);
    expect(onSegmentUpdate).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      null
    );
  });
});
