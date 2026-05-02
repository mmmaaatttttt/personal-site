import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import COLORS from "@/utils/styles";
import GamingRelationships, { type GamingVisData } from ".";

vi.mock("odex", () => ({
  Solver: vi.fn().mockImplementation((_fn: unknown, _n: number) => ({
    solve: vi.fn(),
    grid: vi.fn((_step: number, cb: (x: number, y: number[]) => void) => {
      cb(0, [1, -1]);
      cb(1, [2, -2]);
      return vi.fn();
    }),
  })),
}));

vi.mock("@/components/story/shared/Caption", () => ({
  default: ({ children, caption }: any) => (
    <div>
      <div data-testid="caption">{caption}</div>
      {children}
    </div>
  ),
}));

vi.mock("@/components/story/shared/Graph", () => ({
  default: ({ children, xLabel, yLabel, svgId }: any) => (
    <div
      data-testid="graph"
      data-xlabel={xLabel}
      data-ylabel={yLabel}
      data-svgid={svgId}
    >
      {children}
    </div>
  ),
}));

vi.mock("@/components/story/shared/LinePlot", () => ({
  default: ({ stroke }: any) => (
    <path data-testid="line-plot" stroke={stroke} />
  ),
}));

vi.mock("@/components/story/shared/Slider/SliderGroup", () => ({
  default: ({ data }: any) => (
    <div data-testid="slider-group" data-count={data.length} />
  ),
}));

vi.mock("@/components/story/shared/ColumnLayout", () => ({
  default: ({ children }: any) => (
    <div data-testid="column-layout">{children}</div>
  ),
}));

vi.mock("@/components/story/shared/FlexContainer", () => ({
  default: ({ children }: any) => (
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
  it("renders the caption", () => {
    render(
      <GamingRelationships
        visData={twoPersonVisData}
        caption="Figure 1: Test caption."
      />,
    );
    expect(screen.getByTestId("caption")).toHaveTextContent(
      "Figure 1: Test caption.",
    );
  });

  it("renders without a caption", () => {
    render(<GamingRelationships visData={twoPersonVisData} />);
    expect(screen.getByTestId("caption")).toBeEmptyDOMElement();
  });

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
});
