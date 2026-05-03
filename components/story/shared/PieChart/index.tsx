import { arc, type DefaultArcObject, pie } from "d3-shape";
import { type FC, useMemo } from "react";
import ClippedSVG from "../ClippedSVG";
import PieSlice from "./PieSlice";

interface PieChartProps {
  colorScale: (key: number) => string;
  height?: number;
  padding?: number;
  percentFormat?: string;
  showLabels?: boolean;
  stroke?: string;
  textFill?: string;
  values: number[];
  width?: number;
  innerRadius?: number;
}

const PieChart: FC<PieChartProps> = ({
  colorScale,
  height = 600,
  padding = 0,
  percentFormat = ".0%",
  showLabels = true,
  stroke = "white",
  textFill = "white",
  values,
  width = 600,
  innerRadius = 0,
}) => {
  const radius = width / 2 - padding;

  const arcs = useMemo(() => {
    return pie<number>()
      .sortValues((a, b) => values.indexOf(a) - values.indexOf(b))
      .sort(null)(values);
  }, [values]);

  const pathArc = useMemo(() => {
    return arc<DefaultArcObject>().innerRadius(innerRadius).outerRadius(radius);
  }, [innerRadius, radius]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <ClippedSVG id="pie" width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {arcs.map((d) => (
            <PieSlice
              key={d.index}
              datum={d}
              index={d.index}
              pathArc={pathArc}
              colorScale={colorScale}
              stroke={stroke}
              showLabels={showLabels}
              textFill={textFill}
              percentFormat={percentFormat}
            />
          ))}
        </g>
      </ClippedSVG>
    </div>
  );
};

export default PieChart;
