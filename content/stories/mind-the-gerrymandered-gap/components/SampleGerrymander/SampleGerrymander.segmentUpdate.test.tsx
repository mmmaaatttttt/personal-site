import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SampleGerrymander from ".";

interface CapturedInteractiveGridProps {
  segments: boolean[][];
  onSegmentUpdate: (row: number, col: number, status: boolean | null) => void;
}

const { interactiveGridProps } = vi.hoisted(() => ({
  interactiveGridProps: {
    current: null as unknown as CapturedInteractiveGridProps,
  },
}));

vi.mock("./InteractiveGrid", () => ({
  default: (props: CapturedInteractiveGridProps) => {
    interactiveGridProps.current = props;
    return null;
  },
}));

beforeEach(() => {
  localStorage.clear();
});

describe("SampleGerrymander handleSegmentUpdate", () => {
  it("ignores a null status update", () => {
    render(<SampleGerrymander onDistrictCountsChange={vi.fn()} />);
    const before = interactiveGridProps.current.segments;

    interactiveGridProps.current.onSegmentUpdate(0, 0, null);

    expect(interactiveGridProps.current.segments).toBe(before);
  });
});
