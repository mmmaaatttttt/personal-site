import { range } from "d3-array";
import { type AxisDomain, type AxisScale, axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import type { ChartContextValue } from "@/context/ChartContext";
import { useChart } from "@/context/ChartContext";

// SVG lines render sharply when centered on a half-pixel boundary
const HALF_PX = 0.5;

interface AxisProps<Domain extends AxisDomain> {
  direction: "x" | "y";
  fontSize?: string;
  labelPosition?: {
    x?: string;
    y?: string;
    dx?: string;
    dy?: string;
  };
  scale: AxisScale<Domain>;
  textAnchor?: "start" | "middle" | "end";
  color?: string;
  tickColor?: string;
  tickSize?: number;
  tickShift?: number;
  tickStep?: number;
  tickValues?: number[];
  tickFormat?: string;
  rotateLabels?: boolean;
  xShift?: number;
  yShift?: number;
}

function defaultXShift(chart: ChartContextValue, direction: "x" | "y"): number {
  if (direction === "y") return chart.padding.left;
  return 0;
}

function defaultYShift(chart: ChartContextValue, direction: "x" | "y"): number {
  if (direction === "x") return chart.height - chart.padding.bottom;
  return 0;
}

function contextTickSize(
  chart: ChartContextValue,
  direction: "x" | "y",
): number {
  if (direction === "x") {
    return chart.gridlinesVertical
      ? -(chart.height - chart.padding.top - chart.padding.bottom)
      : 0;
  }
  return chart.gridlinesHorizontal
    ? -(chart.width - chart.padding.left - chart.padding.right)
    : 0;
}

const Axis = <Domain extends AxisDomain>({
  direction,
  fontSize = "0.8rem",
  labelPosition,
  scale,
  textAnchor,
  color,
  tickColor = "#ccc",
  tickSize,
  tickShift,
  tickStep,
  tickValues,
  tickFormat,
  rotateLabels,
  xShift,
  yShift,
}: AxisProps<Domain>) => {
  const axisRef = useRef<SVGGElement>(null!);
  const chart = useChart();

  const resolvedXShift =
    xShift ?? (chart ? defaultXShift(chart, direction) : 0);
  const resolvedYShift =
    yShift ?? (chart ? defaultYShift(chart, direction) : 0);
  const resolvedTickShift = tickShift ?? 0;
  const resolvedTickSize =
    tickSize ?? (chart ? contextTickSize(chart, direction) : undefined);

  const contextStyle =
    direction === "x" ? chart?.xAxisStyle : chart?.yAxisStyle;
  const resolvedRotateLabels =
    rotateLabels ?? contextStyle?.rotateLabels ?? false;
  const resolvedTextAnchor = textAnchor ?? contextStyle?.textAnchor ?? "middle";
  const resolvedLabelPosition =
    labelPosition ?? contextStyle?.labelPosition ?? null;

  useEffect(() => {
    const axisObj = direction === "x" ? axisBottom(scale) : axisLeft(scale);

    if (tickFormat !== undefined) {
      const formatFn = format(tickFormat);
      axisObj.tickFormat((d: Domain) => {
        if (typeof d === "number") return formatFn(d);
        if (d instanceof Date) return formatFn(d.valueOf());
        return String(d);
      });
    } else {
      axisObj.tickFormat(() => "");
    }

    if (resolvedTickSize !== undefined) {
      axisObj.tickSize(resolvedTickSize).tickSizeOuter(0);
    }

    if (tickValues !== undefined) {
      axisObj.tickValues(tickValues as unknown as Domain[]);
    } else if (tickStep !== undefined) {
      const domain = scale.domain();
      if (typeof domain[0] === "number" && typeof domain[1] === "number") {
        axisObj.tickValues(
          range(
            domain[0],
            domain[1] + tickStep,
            tickStep,
          ) as unknown as Domain[],
        );
      }
    }

    const tickTransform =
      direction === "y"
        ? `translate(${resolvedTickShift}, 0)`
        : `translate(0, ${resolvedTickShift})`;

    const g = select(axisRef.current);
    g.attr(
      "transform",
      `translate(${resolvedXShift - HALF_PX}, ${resolvedYShift - HALF_PX})`,
    )
      .call(axisObj)
      .selectAll(".tick line")
      .attr("transform", tickTransform)
      .attr("stroke", tickColor)
      .attr("stroke-dasharray", "10, 5")
      .attr("pointer-events", "none");

    if (tickFormat !== undefined) {
      const labels = g.selectAll<SVGTextElement, Domain>(".tick text");
      labels
        .style("text-anchor", resolvedTextAnchor)
        .style("font-size", fontSize);

      if (resolvedRotateLabels) {
        labels.attr("transform", "rotate(90)");
      }

      if (resolvedLabelPosition) {
        Object.entries(resolvedLabelPosition).forEach(([attr, val]) => {
          labels.attr(attr, val);
        });
      }

      if (color) {
        labels.style("fill", color);
      }
    }

    if (color) {
      g.select<SVGPathElement>(".domain").attr("stroke", color);
    }
  }, [
    direction,
    fontSize,
    resolvedLabelPosition,
    scale,
    resolvedTextAnchor,
    tickColor,
    resolvedTickSize,
    resolvedTickShift,
    tickStep,
    tickValues,
    tickFormat,
    resolvedRotateLabels,
    resolvedXShift,
    resolvedYShift,
    color,
  ]);

  return <g ref={axisRef} className="axis-group" />;
};

export default Axis;
