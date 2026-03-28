import React, { useEffect, useRef } from "react";
import { axisBottom, axisLeft } from "d3-axis";
import { select } from "d3-selection";
import { range } from "d3-array";
import { format } from "d3-format";

interface AxisProps {
  direction: "x" | "y";
  fontSize?: string;
  labelPosition?: {
    x?: string;
    y?: string;
    dx?: string;
    dy?: string;
  };
  scale: any;
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

const Axis: React.FC<AxisProps> = ({
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
}) => {
  const axisRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!axisRef.current) return;

    const axisObj = direction === "x" ? axisBottom(scale) : axisLeft(scale);
    if (tickFormat) {
      axisObj.tickFormat(format(tickFormat) as any);
    } else {
      axisObj.tickFormat(() => "");
    }

    if (tickSize !== undefined) {
      axisObj.tickSize(tickSize).tickSizeOuter(0);
    }

    if (tickStep !== undefined) {
      const domain = scale.domain();
      axisObj.tickValues(range(domain[0], domain[1] + tickStep, tickStep));
    }

    const transform = direction === "y" ? `translate(${tickShift}, 0)` : `translate(0, ${tickShift})`;

    const g = select(axisRef.current);
    g.attr("transform", `translate(${xShift - 0.5}, ${yShift - 0.5})`)
      .call(axisObj as any)
      .selectAll(".tick line")
      .attr("transform", transform)
      .attr("stroke", tickColor)
      .attr("stroke-dasharray", "10, 5")
      .attr("pointer-events", "none");

    if (tickFormat) {
      const labels = g.selectAll(".tick text");
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
