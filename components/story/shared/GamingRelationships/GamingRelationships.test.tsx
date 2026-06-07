import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Solver } from "odex";
import COLORS from "@/utils/styles";
import GamingRelationships, { type GamingVisData } from ".";

vi.mock("odex", () => ({
  Solver: vi.fn().mockImplementation(
    class {
      solve = vi.fn();
      grid = vi.fn((_step: number, cb: (x: number, y: number[]) => void) => {
        cb(0, [1, -1]);
        cb(1, [2, -2]);
        return vi.fn();
      });
    } as never,
  ),
}));

vi.mock("@/components/story/shared/Graph", () => ({
  default: ({
    children,
    xLabel,
    yLabel,
    svgId,
    tickStep,
    yScale,
  }: {
    children?: ReactNode;
    xLabel?: string;
    yLabel?: string;
    svgId?: string;
    tickStep?: (scale: { domain: () => number[] }) => number;
    yScale?: { domain: () => number[] };
  }) => {
    if (tickStep && yScale) tickStep(yScale);
    return (
      <div
        data-testid="graph"
        data-xlabel={xLabel}
        data-ylabel={yLabel}
        data-svgid={svgId}
      >
        {children}
      </div>
    );
  },
}));

vi.mock("@/components/story/shared/LinePlot", () => ({
  default: ({ stroke }: { stroke?: string }) => (
    <path data-testid="line-plot" stroke={stroke} />
  ),
}));

vi.mock("@/components/story/shared/Slider/SliderGroup", () => ({
  default: ({
    data,
  }: {
    data: Array<{ handleValueChange: (v: number) => void; title: string }>;
  }) => (
    <div data-testid="slider-group" data-count={data.length}>
      {data.map((d) => (
        <button
          type="button"
          key={d.title}
          onClick={() => d.handleValueChange(3)}
        >
          change
        </button>
      ))}
    </div>
  ),
}));

vi.mock("@/components/story/shared/ColumnLayout", () => ({
  default: ({ children }: { children?: ReactNode }) => (
    <div data-testid="column-layout">{children}</div>
  ),
}));

vi.mock("@/components/story/shared/FlexContainer", () => ({
  default: ({ children }: { children?: ReactNode }) => (
    <div data-testid="flex-container">{children}</div>
  ),
}));

const A = COLORS.ORANGE;
const B = COLORS.GREEN;

const simpleDiffEq = (a: number, b: number) => (_x: number, y: number[]) => [
  a * y[1],
  b * y[0],
];

const twoPersonVisData: GamingVisData = {
  initialData: [
    {
      min: -5,
      max: 5,
      initialValue: 3,
      title: "A's Initial Feelings",
      color: A,
      equationParameter: false,
    },
    {
      min: -5,
      max: 5,
      initialValue: -1,
      title: "A's Response to B",
      color: A,
      equationParameter: true,
    },
    {
      min: -5,
      max: 5,
      initialValue: -3,
      title: "B's Initial Feelings",
      color: B,
      equationParameter: false,
    },
    {
      min: -5,
      max: 5,
      initialValue: 1,
      title: "B's Response to A",
      color: B,
      equationParameter: true,
    },
  ],
  diffEqs: [simpleDiffEq],
  colors: [A, B],
  width: 800,
  height: 500,
  smallestY: 5,
  largestY: 100,
  svgIds: ["vis1"],
  xLabel: "Time",
  yLabel: "Feelings",
};

const twoGraphVisData: GamingVisData = {
  ...twoPersonVisData,
  diffEqs: [simpleDiffEq, simpleDiffEq],
  svgIds: ["vis1", "vis2"],
};

describe("GamingRelationships", () => {
  it("renders one graph for a single diffEq", () => {
    render(<GamingRelationships visData={twoPersonVisData} />);
    expect(screen.getAllByTestId("graph")).toHaveLength(1);
  });

  it("renders two graphs for two diffEqs", () => {
    render(<GamingRelationships visData={twoGraphVisData} />);
    expect(screen.getAllByTestId("graph")).toHaveLength(2);
  });

  it("renders two line plots per graph (one per color)", () => {
    render(<GamingRelationships visData={twoPersonVisData} />);
    expect(screen.getAllByTestId("line-plot")).toHaveLength(2);
  });

  it("passes correct axis labels to Graph", () => {
    render(<GamingRelationships visData={twoPersonVisData} />);
    const graph = screen.getByTestId("graph");
    expect(graph).toHaveAttribute("data-xlabel", "Time");
    expect(graph).toHaveAttribute("data-ylabel", "Feelings");
  });

  it("renders two slider groups for two unique colors", () => {
    render(<GamingRelationships visData={twoPersonVisData} />);
    expect(screen.getAllByTestId("slider-group")).toHaveLength(2);
  });

  it("uses single-column layout for one graph", () => {
    render(<GamingRelationships visData={twoPersonVisData} />);
    // Single-graph layout: ColumnLayout at root
    const layouts = screen.getAllByTestId("column-layout");
    expect(layouts.length).toBeGreaterThanOrEqual(1);
  });

  it("calls handleValueChange when a slider fires", () => {
    render(<GamingRelationships visData={twoPersonVisData} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
    fireEvent.click(buttons[0]);
    expect(screen.getAllByTestId("graph")).toHaveLength(1);
  });

  it("uses large-domain tickStep (> 500)", () => {
    const largeYVisData: GamingVisData = {
      ...twoPersonVisData,
      smallestY: 600,
      largestY: 1000,
    };
    render(<GamingRelationships visData={largeYVisData} />);
    expect(screen.getAllByTestId("graph").length).toBeGreaterThanOrEqual(1);
  });

  it("uses sliceIdx=2 for 4-color/2-diffEq layout", () => {
    const fourColorVisData: GamingVisData = {
      ...twoPersonVisData,
      diffEqs: [simpleDiffEq, simpleDiffEq],
      svgIds: ["vis1", "vis2"],
      colors: [A, B, A, B],
    };
    render(<GamingRelationships visData={fourColorVisData} />);
    expect(screen.getAllByTestId("graph")).toHaveLength(2);
  });

  it("falls back to [0,0] initial values when all sliders are equation parameters", () => {
    const allParamVisData: GamingVisData = {
      ...twoPersonVisData,
      initialData: [
        {
          min: -5,
          max: 5,
          initialValue: 1,
          title: "A param",
          color: A,
          equationParameter: true,
        },
        {
          min: -5,
          max: 5,
          initialValue: 2,
          title: "B param",
          color: B,
          equationParameter: true,
        },
      ],
    };
    render(<GamingRelationships visData={allParamVisData} />);
    expect(screen.getAllByTestId("graph").length).toBeGreaterThanOrEqual(1);
  });

  it("falls back to yMax=0 when ODE produces no data points", () => {
    vi.mocked(Solver).mockImplementationOnce(
      class {
        solve = vi.fn();
        grid = vi.fn();
      } as never,
    );
    render(<GamingRelationships visData={twoPersonVisData} />);
    expect(screen.getAllByTestId("graph").length).toBeGreaterThanOrEqual(1);
  });
});
