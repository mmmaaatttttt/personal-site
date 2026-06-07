import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import WarmingDots from "./WarmingDots";

// Mock odex since it does heavy numerical integration
vi.mock("odex", () => ({
  Solver: vi.fn().mockImplementation((_fn: unknown, _n: number) => ({
    solve: vi.fn(),
    grid: vi.fn((_step: number, cb: (x: number, y: number[]) => void) => {
      cb(0, [1, 0]);
      cb(1, [2, 0.1]);
      return vi.fn();
    }),
  })),
}));

vi.mock("@/hooks/useSliders", () => ({
  default: (initialData: { initialValue: number }[]) => ({
    values: initialData.map((d) => d.initialValue),
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
  default: ({
    children,
    xLabel,
    yLabel,
  }: {
    children?: ReactNode;
    xLabel?: string;
    yLabel?: string;
  }) => (
    <div data-testid="graph" data-xlabel={xLabel} data-ylabel={yLabel}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/story/shared/LinePlot", () => ({
  default: ({ stroke }: { stroke?: string }) => (
    <path data-testid="line-plot" stroke={stroke} />
  ),
}));

vi.mock("@/components/story/shared/Caption", () => ({
  default: ({
    children,
    caption,
  }: {
    children?: ReactNode;
    caption?: string;
  }) => (
    <div>
      <div data-testid="caption">{caption}</div>
      {children}
    </div>
  ),
}));

describe("WarmingDots", () => {
  it("renders the caption", () => {
    render(
      <WarmingDots vizIndex={0} caption="Figure 1: Exponential growth." />,
    );
    expect(screen.getByTestId("caption")).toHaveTextContent(
      "Figure 1: Exponential growth.",
    );
  });

  it("renders a Graph and SliderGroup", () => {
    render(<WarmingDots vizIndex={0} caption="Test" />);
    expect(screen.getByTestId("slider-group")).toBeInTheDocument();
    expect(screen.getByTestId("graph")).toBeInTheDocument();
  });

  it("passes correct axis labels for population-only charts (vizIndex 0)", () => {
    render(<WarmingDots vizIndex={0} caption="Test" />);
    const graph = screen.getByTestId("graph");
    expect(graph).toHaveAttribute("data-xlabel", "Time");
    expect(graph).toHaveAttribute("data-ylabel", "Population");
  });

  it("passes correct axis labels for population+environment charts (vizIndex 2)", () => {
    render(<WarmingDots vizIndex={2} caption="Test" />);
    const graph = screen.getByTestId("graph");
    expect(graph).toHaveAttribute(
      "data-ylabel",
      "Population & Environment State",
    );
  });

  it("renders two LinePlots for two-color charts (vizIndex 2)", () => {
    render(<WarmingDots vizIndex={2} caption="Test" />);
    const plots = screen.getAllByTestId("line-plot");
    expect(plots).toHaveLength(2);
  });

  it("renders one LinePlot for single-color charts (vizIndex 0)", () => {
    render(<WarmingDots vizIndex={0} caption="Test" />);
    const plots = screen.getAllByTestId("line-plot");
    expect(plots).toHaveLength(1);
  });

  it("accepts vizIndex as a string", () => {
    render(<WarmingDots vizIndex="4" caption="Test" />);
    expect(screen.getByTestId("graph")).toBeInTheDocument();
  });

  it("defaults to vizIndex 0 when omitted", () => {
    render(<WarmingDots caption="Test" />);
    const graph = screen.getByTestId("graph");
    expect(graph).toHaveAttribute("data-ylabel", "Population");
  });
});
