"use client";

import React, { useMemo } from "react";
import { arc, pie } from "d3-shape";
import { format } from "d3-format";
import { motion, AnimatePresence } from "framer-motion";
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

const PieChart: React.FC<PieChartProps> = ({
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
    // Sort logic to match legacy: by original index
    return pie<number>()
      .sortValues((a, b) => values.indexOf(a) - values.indexOf(b))
      .sort(null)(values);
  }, [values]);

  const pathArc = useMemo(() => {
    return arc<any>().innerRadius(innerRadius).outerRadius(radius);
  }, [innerRadius, radius]);

  const total = useMemo(() => values.reduce((acc, v) => acc + v, 0), [values]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ClippedSVG id="pie" width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          <AnimatePresence>
            {arcs.map((d, i) => {
              const percentage = (d.endAngle - d.startAngle) / (2 * Math.PI);
              const centroid = pathArc.centroid(d);

              return (
                <React.Fragment key={i}>
                  <motion.path
                    d={pathArc(d) || ""}
                    fill={colorScale(i)}
                    stroke={stroke}
                    strokeWidth={3}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                  {showLabels && percentage > 0.05 && (
                    <motion.text
                      x={centroid[0]}
                      y={centroid[1]}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="24"
                      fill={textFill}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="font-bold pointer-events-none"
                    >
                      {format(".0%")(percentage)}
                    </motion.text>
                  )}
                </React.Fragment>
              );
            })}
          </AnimatePresence>
        </g>
      </ClippedSVG>
    </div>
  );
};

export default PieChart;
