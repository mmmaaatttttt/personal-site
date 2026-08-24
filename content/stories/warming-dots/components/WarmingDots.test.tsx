import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { AxisScale } from "d3-axis";
import type { NumberValue } from "d3-scale";

interface CapturedGraphProps {
  children?: ReactNode;
  xLabel?: string;
  yLabel?: string;
  tickStep: (scale: AxisScale<NumberValue>) => number;
}

const { capturedGraphProps, gridImpl, mockValuesOverride } = vi.hoisted(() => ({
  capturedGraphProps: { current: null as unknown as CapturedGraphProps },
  gridImpl: {
    current: (_step: number, cb: (x: number, y: number[]) => void) => {
      cb(0, [1, 0]);
      cb(1, [2, 0.1]);
      return vi.fn();
    },
  },
  mockValuesOverride: { current: null as unknown as number[] | null },
}));

// Mock odex since it does heavy numerical integration
vi.mock("odex", () => ({
  Solver: vi.fn().mockImplementation(
    class {
      solve = vi.fn();
      grid = (step: number, cb: (x: number, y: number[]) => void) =>
        gridImpl.current(step, cb);
    } as never,
  ),
}));

vi.mock("@/hooks/useSliders", () => ({
  default: (initialData: { initialValue: number }[]) => ({
    values:
      mockValuesOverride.current ?? initialData.map((d) => d.initialValue),
    sliderData: initialData.map((d) => ({
      ...d,
      value: d.initialValue,
      handleValueChange: vi.fn(),
    })),
  }),
}));

vi.mock("@/components/story/shared/Slider", () => ({
  SliderGroup: () => <div data-testid="slider-group" />,
}));

vi.mock("@/components/story/shared/FlexContainer", () => ({
  default: ({ children }: { children?: ReactNode }) => (
    <div data-testid="flex-container">{children}</div>
  ),
}));

vi.mock("@/components/story/shared/Graph", () => ({
  default: (props: CapturedGraphProps) => {
    capturedGraphProps.current = props;
    return (
      <div
        data-testid="graph"
        data-xlabel={props.xLabel}
        data-ylabel={props.yLabel}
      >
        {props.children}
      </div>
    );
  },
}));

vi.mock("@/components/story/shared/LinePlot", () => ({
  default: ({ stroke }: { stroke?: string }) => (
    <path data-testid="line-plot" stroke={stroke} />
  ),
}));

import WarmingDots from "./WarmingDots";

afterEach(() => {
  gridImpl.current = (_step: number, cb: (x: number, y: number[]) => void) => {
    cb(0, [1, 0]);
    cb(1, [2, 0.1]);
    return vi.fn();
  };
  mockValuesOverride.current = null;
});

describe("WarmingDots", () => {
  it("renders a Graph and SliderGroup", () => {
    render(<WarmingDots vizIndex={0} />);
    expect(screen.getByTestId("slider-group")).toBeInTheDocument();
    expect(screen.getByTestId("graph")).toBeInTheDocument();
  });

  it("passes correct axis labels for population-only charts (vizIndex 0)", () => {
    render(<WarmingDots vizIndex={0} />);
    const graph = screen.getByTestId("graph");
    expect(graph).toHaveAttribute("data-xlabel", "Time");
    expect(graph).toHaveAttribute("data-ylabel", "Population");
  });

  it("passes correct axis labels for population+environment charts (vizIndex 2)", () => {
    render(<WarmingDots vizIndex={2} />);
    const graph = screen.getByTestId("graph");
    expect(graph).toHaveAttribute(
      "data-ylabel",
      "Population & Environment State",
    );
  });

  it("renders two LinePlots for two-color charts (vizIndex 2)", () => {
    render(<WarmingDots vizIndex={2} />);
    const plots = screen.getAllByTestId("line-plot");
    expect(plots).toHaveLength(2);
  });

  it("renders one LinePlot for single-color charts (vizIndex 0)", () => {
    render(<WarmingDots vizIndex={0} />);
    const plots = screen.getAllByTestId("line-plot");
    expect(plots).toHaveLength(1);
  });

  it("accepts vizIndex as a string", () => {
    render(<WarmingDots vizIndex="4" />);
    expect(screen.getByTestId("graph")).toBeInTheDocument();
  });

  it("defaults to vizIndex 0 when omitted", () => {
    render(<WarmingDots />);
    const graph = screen.getByTestId("graph");
    expect(graph).toHaveAttribute("data-ylabel", "Population");
  });
});

describe("WarmingDots tickStep", () => {
  it("uses a fine step when the domain max exceeds 500", () => {
    render(<WarmingDots vizIndex={0} />);
    const scale = {
      domain: () => [0, 1000],
    } as unknown as AxisScale<NumberValue>;
    expect(capturedGraphProps.current.tickStep(scale)).toBeCloseTo(1);
  });

  it("uses a step of 1 when the domain max is 500 or below", () => {
    render(<WarmingDots vizIndex={0} />);
    const scale = {
      domain: () => [0, 100],
    } as unknown as AxisScale<NumberValue>;
    expect(capturedGraphProps.current.tickStep(scale)).toBe(1);
  });
});

describe("WarmingDots with fewer slider values than data items", () => {
  it("falls back to each item's initial value when no slider value is provided", () => {
    mockValuesOverride.current = [];
    render(<WarmingDots vizIndex={0} />);
    expect(screen.getByTestId("graph")).toBeInTheDocument();
  });
});

describe("WarmingDots with no generated data points", () => {
  it("renders without crashing when the solver produces no points", () => {
    gridImpl.current = () => vi.fn();
    render(<WarmingDots vizIndex={0} />);
    expect(screen.getByTestId("graph")).toBeInTheDocument();
  });
});
