import type { AxisDomain, AxisScale } from "d3-axis";
import type { ReactNode } from "react";
import { ChartContext } from "@/context/ChartContext";
import { paddingObj } from "@/utils/styles";
import Axis from "../Axis";
import AxisLabel from "../AxisLabel";
import ClippedSVG from "../ClippedSVG";
import NarrowContainer from "../NarrowContainer";

interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface GraphProps<XDomain extends AxisDomain, YDomain extends AxisDomain> {
  children?: ReactNode;
  graphPadding?: number | Padding;
  gridlinesHorizontal?: boolean;
  gridlinesVertical?: boolean;
  height?: number;
  width?: number;
  svgId?: string;
  svgPadding?: number | Padding;
  tickFormatX?: string;
  tickFormatY?: string;
  tickFontSizeX?: string;
  tickFontSizeY?: string;
  tickStep?: (scale: AxisScale<XDomain | YDomain>) => number;
  tickStepX?: (scale: AxisScale<XDomain>) => number;
  tickStepY?: (scale: AxisScale<YDomain>) => number;
  xAxisPosition?: "bottom" | "center";
  yAxisPosition?: "left" | "center";
  /** "left" (default): y-axis tick labels appear to the left of the axis line.
   *  "right": labels appear to the right, inside the chart — avoids clipping when left padding is small. */
  yLabelSide?: "left" | "right";
  /** When true, the y-axis is rendered after {children} in SVG order, so labels
   *  paint on top of bars. Default false (y-axis renders before children). */
  yAxisOnTop?: boolean;
  /** When false, Graph does not render its own Axis components — compose <Axis> as
   *  children instead. They will self-position using ChartContext. Default true. */
  axes?: boolean;
  xLabel?: string;
  xScale: AxisScale<XDomain>;
  yLabel?: string;
  yLabelOffset?: number;
  yScale: AxisScale<YDomain>;
  className?: string;
}

const Graph = <XDomain extends AxisDomain, YDomain extends AxisDomain>({
  children,
  graphPadding = 0,
  gridlinesHorizontal = true,
  gridlinesVertical = true,
  height = 600,
  width = 600,
  svgId = "svg",
  svgPadding = 0,
  tickFormatX,
  tickFormatY,
  tickFontSizeX,
  tickFontSizeY,
  tickStep,
  tickStepX,
  tickStepY,
  xAxisPosition = "bottom",
  yAxisPosition = "left",
  yLabelSide = "left",
  yAxisOnTop = false,
  axes = true,
  xLabel = "",
  xScale,
  yLabel = "",
  yLabelOffset = 0,
  yScale,
  className,
}: GraphProps<XDomain, YDomain>) => {
  const gPadding = paddingObj(graphPadding) as Padding;
  const options = getLabelOptions(
    width,
    height,
    gPadding,
    gridlinesHorizontal,
    gridlinesVertical,
    yLabelOffset,
  );

  const xOptions = options.x[xAxisPosition];
  const yOptions = options.y[yAxisPosition];

  let calculatedTickStepY: number | undefined;
  if (tickStepY) calculatedTickStepY = tickStepY(yScale);
  else if (tickStep)
    calculatedTickStepY = tickStep(yScale as AxisScale<XDomain | YDomain>);

  let calculatedTickStepX: number | undefined;
  if (tickStepX) calculatedTickStepX = tickStepX(xScale);
  else if (tickStep)
    calculatedTickStepX = tickStep(xScale as AxisScale<XDomain | YDomain>);

  const yAxisRight = yLabelSide === "right";

  const chartContextValue = {
    xScale: xScale as unknown as AxisScale<number>,
    yScale: yScale as unknown as AxisScale<number>,
    width,
    height,
    padding: gPadding,
    gridlinesHorizontal,
    gridlinesVertical,
    xAxisStyle: {
      rotateLabels: true,
      textAnchor: "start" as const,
      labelPosition: { y: "0.35em", x: "9", dy: "0" },
    },
    yAxisStyle: {
      rotateLabels: false,
      textAnchor: (yAxisRight ? "start" : "end") as "start" | "end",
      labelPosition: yAxisRight
        ? { x: "4", dy: "12" }
        : { x: "-3", dy: "0.32em" },
    },
  };

  return (
    <ChartContext.Provider value={chartContextValue}>
      <NarrowContainer width="100%" className={className}>
        <ClippedSVG
          id={svgId}
          width={width}
          height={height}
          padding={svgPadding}
        >
          {axes && !yAxisOnTop && (
            <Axis
              key="y-axis"
              direction="y"
              scale={yScale}
              tickSize={yOptions.tickSize}
              tickShift={yOptions.tickShift}
              tickStep={calculatedTickStepY}
              fontSize={tickFontSizeY}
              tickFormat={tickFormatY}
              xShift={yOptions.xShift}
            />
          )}
          {axes && (
            <Axis
              key="x-axis"
              direction="x"
              fontSize={tickFontSizeX}
              scale={xScale}
              tickSize={xOptions.tickSize}
              tickShift={xOptions.tickShift}
              tickStep={calculatedTickStepX}
              tickFormat={tickFormatX}
              yShift={xOptions.yShift}
            />
          )}
          <line
            x1={yOptions.xShift}
            x2={yOptions.xShift}
            y1={gPadding.top}
            y2={height - gPadding.bottom}
            stroke="#000"
            strokeWidth="1"
          />
          {children}
          {axes && yAxisOnTop && (
            <Axis
              key="y-axis"
              direction="y"
              scale={yScale}
              tickSize={yOptions.tickSize}
              tickShift={yOptions.tickShift}
              tickStep={calculatedTickStepY}
              fontSize={tickFontSizeY}
              tickFormat={tickFormatY}
              xShift={yOptions.xShift}
            />
          )}
          {xLabel && <AxisLabel {...xOptions.label}>{xLabel}</AxisLabel>}
          {yLabel && (
            <AxisLabel
              {...yOptions.label}
              transform={`rotate(-90 10,${height / 2})`}
            >
              {yLabel}
            </AxisLabel>
          )}
        </ClippedSVG>
      </NarrowContainer>
    </ChartContext.Provider>
  );
};

function getLabelOptions(
  width: number,
  height: number,
  padding: Padding,
  hGrid: boolean,
  vGrid: boolean,
  yOff: number,
) {
  const { top, bottom, left, right } = padding;
  const xTickSize = vGrid ? -height + top + bottom : 0;
  const yTickSize = hGrid ? -width + left + right : 0;
  return {
    x: {
      bottom: {
        yShift: height - bottom,
        tickSize: xTickSize,
        tickShift: 0,
        label: {
          x: width / 2,
          y: height - bottom,
          dx: 0,
          dy: bottom * 0.7,
          anchor: "middle" as const,
        },
      },
      center: {
        yShift: height / 2,
        tickSize: xTickSize,
        tickShift: (height - top - bottom) / 2,
        label: {
          x: width,
          y: height / 2,
          anchor: "end" as const,
          dx: -(left + right) / 2,
          dy: (top + bottom) / 2,
        },
      },
    },
    y: {
      left: {
        xShift: left,
        tickSize: yTickSize,
        tickShift: 0,
        label: {
          x: 10,
          y: height / 2,
          dx: yOff,
          dy: 10,
        },
      },
      center: {
        xShift: width / 2,
        tickSize: yTickSize,
        tickShift: (-width + left + right) / 2,
        label: {
          x: width / 2,
          y: 10,
          dx: 10,
          dy: 10,
        },
      },
    },
  };
}

export default Graph;
