import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SampleGerrymander from ".";
import type InteractiveGrid from "./InteractiveGrid";

type InteractiveGridProps = ComponentProps<typeof InteractiveGrid>;

const { interactiveGridProps } = vi.hoisted(() => ({
  interactiveGridProps: { current: null as unknown as InteractiveGridProps },
}));

vi.mock("./InteractiveGrid", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./InteractiveGrid")>();
  const RealInteractiveGrid = actual.default;
  return {
    default: (props: InteractiveGridProps) => {
      interactiveGridProps.current = props;
      return <RealInteractiveGrid {...props} />;
    },
  };
});

beforeEach(() => {
  localStorage.clear();
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SampleGerrymander", () => {
  it("renders without crashing", () => {
    render(<SampleGerrymander onDistrictCountsChange={vi.fn()} />);
  });

  it("renders the district status panel", () => {
    render(<SampleGerrymander onDistrictCountsChange={vi.fn()} />);
    expect(screen.getByText(/D1:/)).toBeInTheDocument();
    expect(screen.getByText(/D6:/)).toBeInTheDocument();
  });

  it("renders the Save and Reset buttons", () => {
    render(<SampleGerrymander onDistrictCountsChange={vi.fn()} />);
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("calls onDistrictCountsChange(null) initially (no valid districts)", () => {
    const onDistrictCountsChange = vi.fn();
    render(
      <SampleGerrymander onDistrictCountsChange={onDistrictCountsChange} />,
    );
    // Initial state: 1 region spanning all cells — not 6 districts of size 9 each
    expect(onDistrictCountsChange).toHaveBeenCalledWith(null);
  });

  it("loads segments from localStorage on mount", async () => {
    // Store segments that fully divide the 6x9 grid into 6 horizontal strips
    // Each strip = one horizontal row of 9 cells
    // We need 5 horizontal dividers: segments[1], segments[3], segments[5], segments[7], segments[9]
    // Each is a row of 9 booleans, all true
    const segments: boolean[][] = Array.from({ length: 11 }, (_, i) => {
      if (i % 2 === 1) {
        // horizontal divider row: 9 elements
        return Array(9).fill(true);
      }
      // vertical divider row: 8 elements, all false (no vertical boundaries)
      return Array(8).fill(false);
    });
    localStorage.setItem("segments", JSON.stringify(segments));

    const onDistrictCountsChange = vi.fn();
    await act(async () => {
      render(
        <SampleGerrymander onDistrictCountsChange={onDistrictCountsChange} />,
      );
    });

    // Should eventually call with valid district counts
    const calls = onDistrictCountsChange.mock.calls;
    const validCall = calls.find((c) => c[0] !== null);
    expect(validCall).toBeTruthy();
  });

  it("resets segments and clears localStorage on Reset click", () => {
    // Store valid-shaped segments (rowCount*2-1=11 rows) so the component loads them
    const segments = Array.from({ length: 11 }, (_, i) =>
      Array(i % 2 === 0 ? 8 : 9).fill(false),
    );
    localStorage.setItem("segments", JSON.stringify(segments));
    const onDistrictCountsChange = vi.fn();
    render(
      <SampleGerrymander onDistrictCountsChange={onDistrictCountsChange} />,
    );

    fireEvent.click(screen.getByText("Reset"));
    expect(localStorage.getItem("segments")).toBeNull();
  });

  it("saves segments to localStorage on Save click", () => {
    const { container } = render(
      <SampleGerrymander onDistrictCountsChange={vi.fn()} />,
    );
    expect(localStorage.getItem("segments")).toBeNull();

    const lines = container.querySelectorAll("line");
    fireEvent.pointerDown(lines[0]);
    fireEvent.click(screen.getByText("Save"));

    expect(localStorage.getItem("segments")).not.toBeNull();
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("toggles the segment at the clicked line on pointer down", () => {
    const { container } = render(
      <SampleGerrymander onDistrictCountsChange={vi.fn()} />,
    );
    const lines = container.querySelectorAll("line");
    const targetLine = lines[0];
    const initialStroke = targetLine.getAttribute("stroke");

    fireEvent.pointerDown(targetLine);

    expect(targetLine.getAttribute("stroke")).not.toBe(initialStroke);
  });

  it("ignores a null status update from InteractiveGrid", () => {
    render(<SampleGerrymander onDistrictCountsChange={vi.fn()} />);
    const before = interactiveGridProps.current.segments;

    interactiveGridProps.current.onSegmentUpdate(0, 0, null);

    expect(interactiveGridProps.current.segments).toBe(before);
  });
});
