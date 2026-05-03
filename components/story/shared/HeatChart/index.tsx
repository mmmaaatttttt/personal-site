"use client";

import { interpolateRgb, piecewise } from "d3-interpolate";
import { scaleLinear } from "d3-scale";
import { useMemo } from "react";
import Axis from "@/components/story/shared/Axis";
import AxisLabel from "@/components/story/shared/AxisLabel";
import ClippedSVG from "@/components/story/shared/ClippedSVG";
import Tooltip, { useTooltip } from "@/components/story/shared/Tooltip";
import COLORS from "@/utils/styles";

const WIDTH = 600;

export interface HeatChartProps<T> {
  data: (T | null)[][];
  accessor: (d: T) => number;
  getTooltipBody: (d: T, x: number, y: number) => string[];
  colorDomain: number[];
  colorRange: string[];
  xAxisLabel: string;
  yAxisLabel: string;
  axes?: boolean;
  paddingScale?: number;
}

function HeatChart<T>({
  data,
  accessor,
  getTooltipBody,
  colorDomain,
  colorRange,
  xAxisLabel,
  yAxisLabel,
  axes = true,
  paddingScale = 0.075,
}: HeatChartProps<T>) {
  const { tooltip, showTooltip, hideTooltip } = useTooltip();

  const numCols = data.length;
  const numRows = data[0]?.length ?? 0;
  const squareWidth = WIDTH / numCols;
  const height = numRows * squareWidth;
  const padX = WIDTH * paddingScale;
  const padY = height * paddingScale;

  const xScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, numCols])
        .range([padX, WIDTH - padX]),
    [numCols, padX],
  );
  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, numRows])
        .range([height - padY, padY]),
    [numRows, height, padY],
  );

  const colorScale = useMemo(() => {
    const interp = piecewise(interpolateRgb, colorRange);
    return (value: number) => {
      const min = colorDomain[0];
      const max = colorDomain[colorDomain.length - 1];
      const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return interp(t);
    };
  }, [colorDomain, colorRange]);

  const rectW = xScale(1) - 2 - padX;
  const rectH = height - yScale(1) - 2 - padY;

  return (
    <div>
      <ClippedSVG
        id="heat-chart"
        width={WIDTH}
        height={height}
        clipChildren={false}
      >
        {data
          .flatMap((col, x) => col.map((d, y) => ({ d, x, y, cellKey: `${x}:${y}` })))
          .map(({ d, x, y, cellKey }) => {
            if (d == null) return null;
            return (
              <rect
                key={cellKey}
                role="menuitem"
                tabIndex={0}
                x={xScale(x) + 1}
                y={yScale(y + 1) + 1}
                width={rectW}
                height={rectH}
                fill={colorScale(accessor(d))}
                style={{ transition: "fill 0.5s" }}
                onMouseMove={showTooltip("", getTooltipBody(d, x, y))}
                onTouchMove={showTooltip("", getTooltipBody(d, x, y))}
                onMouseLeave={hideTooltip}
                onTouchEnd={hideTooltip}
                onKeyDown={hideTooltip}
              />
            );
          })}
        {axes && (
          <>
            <Axis
              direction="x"
              labelPosition={{ y: "9", dy: "0.71em" }}
              scale={xScale}
              tickFormat=","
              tickColor={COLORS.BLACK}
              yShift={height - padY}
            />
            <Axis
              direction="y"
              labelPosition={{ x: "-9", dy: "0.32em" }}
              scale={yScale}
              textAnchor="end"
              tickFormat=","
              tickColor={COLORS.BLACK}
              xShift={padX}
            />
            <AxisLabel x={WIDTH / 2} y={height}>
              {xAxisLabel}
            </AxisLabel>
            <AxisLabel
              x={0}
              y={height / 2}
              transform={`rotate(-90 10,${height / 2})`}
              dy={10}
            >
              {yAxisLabel}
            </AxisLabel>
          </>
        )}
      </ClippedSVG>
      <Tooltip info={tooltip} />
    </div>
  );
}

export default HeatChart;
