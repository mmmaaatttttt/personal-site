import { FC } from "react";
import { line, curveNatural, curveLinear } from "d3-shape";
import { AxisScale } from "d3-axis";
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
  xScale: AxisScale<number>;
  yScale: AxisScale<number>;
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
  const linePath = line<Point>()
    .x((d) => xScale(d.x) ?? 0)
    .y((d) => yScale(d.y) ?? 0)
    .curve(curves[curve]);

  const truncateData = () =>
    graphData.map((d) => {
      let newY = d.y;
      const yDomain = yScale.domain();
      // Add a small buffer to prevent paths from being completely cut off if they just touch the edge
      if (newY > yDomain[1]) newY = yDomain[1] * 1.05;
      if (newY < yDomain[0]) newY = yDomain[0] * 1.05;
      return { ...d, y: newY };
    });

  if (!graphData.length) return null;

  return (
    <path
      d={linePath(truncateData()) || ""}
      strokeWidth={strokeWidth}
      stroke={stroke}
      fill="none"
      opacity={opacity}
      className="transition-all duration-300 ease-in-out"
    />
  );
};

export default LinePlot;
