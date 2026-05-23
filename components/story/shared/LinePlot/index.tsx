import type { AxisScale } from "d3-axis";
import { curveLinear, curveNatural, line } from "d3-shape";
import type { FC } from "react";
import { useChart } from "@/context/ChartContext";
import COLORS from "@/utils/styles";

interface Point {
  x: number;
  y: number;
}

interface LinePlotProps {
  curve?: "curveNatural" | "curveLinear";
  graphData: Point[];
  opacity?: number | string;
  stroke?: string;
  strokeWidth?: number;
  /** Falls back to ChartContext xScale when omitted. */
  xScale?: AxisScale<number>;
  /** Falls back to ChartContext yScale when omitted. */
  yScale?: AxisScale<number>;
}

const curves = { curveNatural, curveLinear };

const LinePlot: FC<LinePlotProps> = ({
  curve = "curveNatural",
  graphData = [],
  opacity = 1,
  stroke = COLORS.ORANGE,
  strokeWidth = 5,
  xScale,
  yScale,
}) => {
  const chart = useChart();
  const resolvedXScale = xScale ?? chart?.xScale;
  const resolvedYScale = yScale ?? chart?.yScale;

  if (!graphData.length) return null;
  if (!resolvedXScale || !resolvedYScale) return null;

  const linePath = line<Point>()
    .x((d) => resolvedXScale(d.x) ?? 0)
    .y((d) => resolvedYScale(d.y) ?? 0)
    .curve(curves[curve]);

  const truncateData = () =>
    graphData.map((d) => {
      let newY = d.y;
      const yDomain = resolvedYScale.domain();
      // Add a small buffer to prevent paths from being completely cut off if they just touch the edge
      if (newY > yDomain[1]) newY = yDomain[1] * 1.05;
      if (newY < yDomain[0]) newY = yDomain[0] * 1.05;
      return { ...d, y: newY };
    });

  return (
    <path
      d={linePath(truncateData()) || ""}
      strokeWidth={strokeWidth}
      stroke={stroke}
      fill="none"
      opacity={opacity}
    />
  );
};

export default LinePlot;
