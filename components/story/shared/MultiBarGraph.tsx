"use client";

import { FC, useMemo } from "react";
import { min, max } from "d3-array";
import { stack as d3stack, stackOffsetNone } from "d3-shape";
import { scaleBand, scaleLinear } from "d3-scale";
import { motion, AnimatePresence } from "framer-motion";
import Axis from "./Axis";
import AxisLabel from "./AxisLabel";
import ClippedSVG from "./ClippedSVG";
import Legend from "./Legend";
import NarrowContainer from "./NarrowContainer";
import { useTooltip } from "./Tooltip";
import Tooltip from "./Tooltip";

interface MultiBarData {
  meta: Record<string, any>;
  counts: Record<string, number>;
}

interface MultiBarGraphProps {
  colors?: string[];
  containerWidth?: string | number;
  data: MultiBarData[];
  height?: number;
  id?: string;
  legendTitle?: string;
  padding?:
    | number
    | { top: number; bottom: number; left: number; right: number };
  getTooltipData: (d: MultiBarData) => {
    title: string;
    body: string[] | string;
  };
  width?: number;
  yAxisLabel?: string;
  yMax?: number;
}

const MultiBarGraph: FC<MultiBarGraphProps> = ({
  colors = ["red", "blue"],
  containerWidth = "100%",
  data,
  height = 400,
  id = "multi-bar-graph",
  legendTitle = "Legend",
  padding = 0,
  getTooltipData,
  width = 600,
  yAxisLabel = "Y Axis",
  yMax,
}) => {
  const p =
    typeof padding === "number"
      ? { top: padding, bottom: padding, left: padding, right: padding }
      : padding;
  const { tooltip, showTooltip, hideTooltip } = useTooltip();

  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const labels = Object.keys(data[0]?.counts || {});
  if (labels.length === 0) return null;

  const stackData = useMemo(() => {
    try {
      return d3stack().keys(labels).offset(stackOffsetNone)(
        data.map((d) => d.counts || {}),
      );
    } catch (e) {
      console.error("MultiBarGraph stacking error:", e);
      return [];
    }
  }, [labels, data]);

  if (stackData.length === 0) return null;

  const tooltipData = useMemo(
    () => data.map(getTooltipData),
    [data, getTooltipData],
  );

  const yMin = min(stackData[0], (d) => d[0]) || 0;
  const computedYMax =
    yMax || max(stackData[stackData.length - 1], (d) => d[1]) || 1;

  const xScale = scaleBand()
    .domain(stackData[0].map((_, i) => i.toString()))
    .rangeRound([p.left, width - p.right])
    .padding(0.1);

  const yScale = scaleLinear()
    .domain([yMin, computedYMax])
    .range([height - p.bottom, p.top]);

  return (
    <NarrowContainer
      width={containerWidth.toString()}
      className="relative w-full"
    >
      <Legend
        title={legendTitle}
        labels={labels.map((label, i) => ({ text: label, color: colors[i] }))}
      />
      <ClippedSVG id={id} width={width} height={height} clipChildren={false}>
        <g>
          <Axis
            direction="y"
            fontSize="0.8rem"
            labelPosition={{ x: "-3", dy: "0.32em" }}
            scale={yScale}
            xShift={p.left}
            yShift={0}
            textAnchor="end"
            tickFormat={",.0f"}
            tickSize={-width + p.left + p.right}
          />
          <Axis
            direction="x"
            scale={xScale}
            yShift={height - p.bottom}
            fontSize="0.8rem"
            tickFormat={""}
          />

          <g clipPath={`url(#clip-path-${id})`}>
            <AnimatePresence>
              {data.map((_, colIndex) => {
                const { title, body } = tooltipData[colIndex];
                const extentsForCol = stackData.map((layer) => layer[colIndex]);
                const colX = xScale(colIndex.toString());

                return (
                  <g
                    key={`col-${colIndex}`}
                    className="cursor-pointer opacity-80 transition-opacity hover:opacity-100"
                  >
                    {extentsForCol.map(([minVal, maxVal], layerIndex) => {
                      const rectY = yScale(maxVal);
                      const rectHeight = Math.max(
                        0,
                        yScale(minVal) - yScale(maxVal),
                      );

                      return (
                        <motion.rect
                          key={`rect-${colIndex}-${layerIndex}`}
                          fill={colors[layerIndex]}
                          initial={{ height: 0, y: yScale(minVal) }}
                          animate={{
                            x: colX,
                            y: rectY,
                            height: rectHeight,
                            width: (xScale.step() || 0) * 0.8,
                          }}
                          transition={{ duration: 0.5, delay: colIndex * 0.02 }}
                          onMouseMove={showTooltip(title, body)}
                          onMouseLeave={hideTooltip}
                          onTouchMove={showTooltip(title, body)}
                          onTouchEnd={hideTooltip}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </AnimatePresence>
          </g>

          <AxisLabel
            x={10}
            y={height / 2}
            dy={-60}
            transform={`rotate(-90 10,${height / 2})`}
            fontSize="1rem"
          >
            {yAxisLabel}
          </AxisLabel>
        </g>
      </ClippedSVG>
      <Tooltip info={tooltip} />
    </NarrowContainer>
  );
};

export default MultiBarGraph;
