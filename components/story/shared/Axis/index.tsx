import { FC, useEffect, useRef } from "react";
import { axisBottom, axisLeft, AxisScale, AxisDomain } from "d3-axis";
import { select } from "d3-selection";
import { range } from "d3-array";
import { format } from "d3-format";

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

const Axis = <Domain extends AxisDomain>({
  direction,
  fontSize = "0.8rem",
  labelPosition = { x: "0", y: "0", dx: "0", dy: "0" },
  scale,
  textAnchor = "middle",
  tickColor = "#ccc",
  tickSize,
  tickShift = 0,
  tickStep,
  tickFormat = "",
  rotateLabels = false,
  xShift = 0,
  yShift = 0,
}: AxisProps<Domain>) => {
  const axisRef = useRef<SVGGElement>(null);

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

    if (tickSize !== undefined) {
      axisObj.tickSize(tickSize).tickSizeOuter(0);
    }

    if (tickStep !== undefined) {
      const domain = scale.domain();
      // Only apply tickStep if domain values are numbers
      if (typeof domain[0] === 'number' && typeof domain[1] === 'number') {
        axisObj.tickValues(range(domain[0], domain[1] + tickStep, tickStep) as unknown as Domain[]);
      }
    }

    const transform = direction === "y" ? `translate(${tickShift}, 0)` : `translate(0, ${tickShift})`;

    const g = select(axisRef.current);
    g.attr("transform", `translate(${xShift - 0.5}, ${yShift - 0.5})`)
      .call(axisObj)
      .selectAll(".tick line")
      .attr("transform", transform)
      .attr("stroke", tickColor)
      .attr("stroke-dasharray", "10, 5")
      .attr("pointer-events", "none");

    if (tickFormat !== undefined) {
      const labels = g.selectAll<SVGTextElement, Domain>(".tick text");
      labels
        .style("text-anchor", textAnchor)
        .style("font-size", fontSize);

      if (rotateLabels) {
        labels.attr("transform", "rotate(90)");
      }

      // fine-tune text label position
      Object.entries(labelPosition).forEach(([attr, val]) => {
        labels.attr(attr, val);
      });
    }
  }, [direction, fontSize, labelPosition, scale, textAnchor, tickColor, tickSize, tickShift, tickStep, tickFormat, rotateLabels, xShift, yShift]);

  return <g ref={axisRef} className="axis-group" />;
};

export default Axis;
