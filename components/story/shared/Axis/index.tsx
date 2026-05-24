import { range } from "d3-array";
import { type AxisDomain, type AxisScale, axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import type { ChartContextValue } from "@/context/ChartContext";
import { useChart } from "@/context/ChartContext";

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
  tickColor?: string;
  tickSize?: number;
  tickShift?: number;
  tickStep?: number;
  tickFormat?: string;
  rotateLabels?: boolean;
  xShift?: number;
  yShift?: number;
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
  tickColor = "#ccc",
  tickSize,
  tickShift,
  tickStep,
  tickFormat,
  rotateLabels,
  xShift,
  yShift,
}: AxisProps<Domain>) => {
  const axisRef = useRef<SVGGElement>(null);
  const chart = useChart();

  // Geometry props derive from ChartContext when absent — explicit props always win.
  const resolvedXShift =
    xShift ?? (chart && direction === "y" ? chart.padding.left : 0);
  const resolvedYShift =
    yShift ??
    (chart && direction === "x" ? chart.height - chart.padding.bottom : 0);
  const resolvedTickShift = tickShift ?? 0;
  const resolvedTickSize =
    tickSize ?? (chart ? contextTickSize(chart, direction) : undefined);

  // Styling props derive from ChartContext axis style defaults when absent — explicit props always win.
  // Falls back to hardcoded defaults when there is no context (e.g. HeatChart uses Axis standalone).
  const contextStyle =
    direction === "x" ? chart?.xAxisStyle : chart?.yAxisStyle;
  const resolvedRotateLabels =
    rotateLabels ?? contextStyle?.rotateLabels ?? false;
  const resolvedTextAnchor = textAnchor ?? contextStyle?.textAnchor ?? "middle";
  const resolvedLabelPosition = labelPosition ??
    contextStyle?.labelPosition ?? { x: "0", y: "0", dx: "0", dy: "0" };

  useEffect(() => {
    if (!axisRef.current) return;

    const axisObj = direction === "x" ? axisBottom(scale) : axisLeft(scale);
    if (tickFormat !== undefined) {
      // Show labels using the provided d3 format string.
      const formatFn = format(tickFormat);
      axisObj.tickFormat((d: Domain) => {
        if (typeof d === "number") return formatFn(d);
        if (d instanceof Date) return formatFn(d.valueOf());
        return String(d);
      });
    } else {
      // No format provided → suppress all tick labels (show gridlines only).
      axisObj.tickFormat(() => "");
    }

    if (resolvedTickSize !== undefined) {
      axisObj.tickSize(resolvedTickSize).tickSizeOuter(0);
    }

    if (tickStep !== undefined) {
      const domain = scale.domain();
      // Only apply tickStep if domain values are numbers
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

    const transform =
      direction === "y"
        ? `translate(${resolvedTickShift}, 0)`
        : `translate(0, ${resolvedTickShift})`;

    const g = select(axisRef.current);
    g.attr(
      "transform",
      `translate(${resolvedXShift - 0.5}, ${resolvedYShift - 0.5})`,
    )
      .call(axisObj)
      .selectAll(".tick line")
      .attr("transform", transform)
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

      // fine-tune text label position
      Object.entries(resolvedLabelPosition).forEach(([attr, val]) => {
        labels.attr(attr, val);
      });
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
    tickFormat,
    resolvedRotateLabels,
    resolvedXShift,
    resolvedYShift,
  ]);

  return <g ref={axisRef} className="axis-group" />;
};

export default Axis;
