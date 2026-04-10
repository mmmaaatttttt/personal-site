"use client";

import { FC, useMemo, Fragment, useEffect } from "react";
import { arc, pie, PieArcDatum } from "d3-shape";
import { format } from "d3-format";
import { motion, useSpring, useTransform, MotionValue } from "framer-motion";
import ClippedSVG from "./ClippedSVG";

interface PieChartProps {
  colorScale: (key: number) => string;
  height?: number;
  padding?: number;
  showLabels?: boolean;
  stroke?: string;
  textFill?: string;
  values: number[];
  width?: number;
  innerRadius?: number;
}

const PieSlice: FC<{
  datum: PieArcDatum<number>;
  index: number;
  pathArc: any;
  colorScale: (key: number) => string;
  stroke: string;
  showLabels: boolean;
  textFill: string;
}> = ({ datum, index, pathArc, colorScale, stroke, showLabels, textFill }) => {
  // Use springs to animate the angles themselves, not the path string
  const startAngle = useSpring(datum.startAngle, { bounce: 0, duration: 500 });
  const endAngle = useSpring(datum.endAngle, { bounce: 0, duration: 500 });

  useEffect(() => {
    startAngle.set(datum.startAngle);
    endAngle.set(datum.endAngle);
  }, [datum.startAngle, datum.endAngle, startAngle, endAngle]);

  // Derive the path and centroid from the animated angles
  const d = useTransform([startAngle, endAngle], ([sa, ea]: number[]) => 
    pathArc({ startAngle: sa, endAngle: ea }) || ""
  );

  const labelX = useTransform([startAngle, endAngle], ([sa, ea]: number[]) => 
    pathArc.centroid({ startAngle: sa, endAngle: ea })[0]
  );
  
  const labelY = useTransform([startAngle, endAngle], ([sa, ea]: number[]) => 
    pathArc.centroid({ startAngle: sa, endAngle: ea })[1]
  );

  const percentage = useTransform([startAngle, endAngle], ([sa, ea]: number[]) => 
    (ea - sa) / (2 * Math.PI)
  );

  // We need to re-render the format logic if percentage changes, 
  // but framer-motion text animation is easier with a separate motion component.
  return (
    <Fragment>
      <motion.path
        d={d}
        fill={colorScale(index)}
        stroke={stroke}
        strokeWidth={3}
      />
      {showLabels && (
        <AnimatedPercentage
          startAngle={startAngle}
          endAngle={endAngle}
          textFill={textFill}
          x={labelX}
          y={labelY}
        />
      )}
    </Fragment>
  );
};

// Sub-component for the live percentage text
const AnimatedPercentage: FC<{
  startAngle: MotionValue<number>;
  endAngle: MotionValue<number>;
  textFill: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
}> = ({ startAngle, endAngle, textFill, x, y }) => {
  const displayValue = useTransform([startAngle, endAngle], ([sa, ea]: number[]) => 
    format(".0%")((ea - sa) / (2 * Math.PI))
  );

  return (
    <motion.text
      style={{ x, y, opacity: useTransform([startAngle, endAngle], ([sa, ea]: number[]) => (ea - sa) / (2 * Math.PI) > 0.05 ? 1 : 0) }}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="24"
      fill={textFill}
      className="pointer-events-none font-bold"
    >
      {displayValue}
    </motion.text>
  );
};

const PieChart: FC<PieChartProps> = ({
  colorScale,
  height = 600,
  padding = 0,
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
    return arc<any>().innerRadius(innerRadius).outerRadius(radius);
  }, [innerRadius, radius]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <ClippedSVG id="pie" width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {arcs.map((d, i) => (
            <PieSlice
              key={i}
              datum={d}
              index={i}
              pathArc={pathArc}
              colorScale={colorScale}
              stroke={stroke}
              showLabels={showLabels}
              textFill={textFill}
            />
          ))}
        </g>
      </ClippedSVG>
    </div>
  );
};

export default PieChart;
