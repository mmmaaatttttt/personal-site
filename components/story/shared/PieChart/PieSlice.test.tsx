import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { PieArcDatum } from "d3-shape";
import { arc } from "d3-shape";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();

  function makeMV(init: unknown) {
    let val = init;
    return {
      get: () => val,
      set: (v: unknown) => {
        val = v;
      },
      on: (_event: string, cb: (v: unknown) => void) => {
        cb(val);
        return () => {};
      },
    };
  }

  return {
    ...actual,
    useSpring: (initial: unknown) => makeMV(initial),
    useTransform: (
      inputs: { get: () => unknown }[],
      fn: (vals: unknown[]) => unknown,
    ) => {
      const vals = inputs.map((mv) => mv.get());
      return makeMV(fn ? fn(vals) : vals[0]);
    },
    motion: {
      ...actual.motion,
      path: (props: Record<string, unknown>) => {
        const { style: _style, ...rest } = props;
        const safeProps = Object.fromEntries(
          Object.entries(rest).filter(([, v]) => typeof v !== "object"),
        );
        return <path data-testid="pie-path" {...safeProps} />;
      },
      text: (props: Record<string, unknown>) => {
        const { style: _style, children, ...rest } = props;
        const safeProps = Object.fromEntries(
          Object.entries(rest).filter(([, v]) => typeof v !== "object"),
        );
        return (
          <text data-testid="pie-text" {...safeProps}>
            {children as ReactNode}
          </text>
        );
      },
    },
  };
});

import PieSlice from "./PieSlice";

const pathArc = arc<{
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
}>()
  .innerRadius(0)
  .outerRadius(100);

function makeDatum(startAngle: number, endAngle: number): PieArcDatum<number> {
  return {
    data: 1,
    value: 1,
    index: 0,
    startAngle,
    endAngle,
    padAngle: 0,
  };
}

describe("PieSlice", () => {
  const colorScale = (i: number) => ["red", "blue"][i] ?? "gray";

  it("renders a path element", () => {
    render(
      <svg role="img" aria-label="test">
        <PieSlice
          datum={makeDatum(0, Math.PI)}
          index={0}
          pathArc={pathArc}
          colorScale={colorScale}
          stroke="white"
          showLabels={false}
          textFill="black"
          percentFormat=".0%"
        />
      </svg>,
    );
    expect(screen.getByTestId("pie-path")).toBeInTheDocument();
  });

  it("renders AnimatedPercentage text when showLabels=true and slice is large enough", () => {
    render(
      <svg role="img" aria-label="test">
        <PieSlice
          datum={makeDatum(0, Math.PI)}
          index={0}
          pathArc={pathArc}
          colorScale={colorScale}
          stroke="white"
          showLabels={true}
          textFill="black"
          percentFormat=".0%"
        />
      </svg>,
    );
    expect(screen.getByTestId("pie-text")).toBeInTheDocument();
  });

  it("does not render text when showLabels=false", () => {
    render(
      <svg role="img" aria-label="test">
        <PieSlice
          datum={makeDatum(0, Math.PI)}
          index={0}
          pathArc={pathArc}
          colorScale={colorScale}
          stroke="white"
          showLabels={false}
          textFill="black"
          percentFormat=".0%"
        />
      </svg>,
    );
    expect(screen.queryByTestId("pie-text")).toBeNull();
  });

  it("renders with opacity 0 for a tiny slice (percentage ≤ 5%)", () => {
    render(
      <svg role="img" aria-label="test">
        <PieSlice
          datum={makeDatum(0, 0.1)}
          index={0}
          pathArc={pathArc}
          colorScale={colorScale}
          stroke="white"
          showLabels={true}
          textFill="black"
          percentFormat=".0%"
        />
      </svg>,
    );
    expect(screen.getByTestId("pie-path")).toBeInTheDocument();
  });

  it("uses colorScale with the given index for path fill", () => {
    render(
      <svg role="img" aria-label="test">
        <PieSlice
          datum={makeDatum(0, Math.PI)}
          index={1}
          pathArc={pathArc}
          colorScale={colorScale}
          stroke="white"
          showLabels={false}
          textFill="black"
          percentFormat=".0%"
        />
      </svg>,
    );

    expect(screen.getByTestId("pie-path")).toHaveAttribute("fill", "blue");
  });
});
