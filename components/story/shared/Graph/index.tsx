import { FC, ReactNode } from "react";
import { AxisScale, AxisDomain } from "d3-axis";
import { cn } from "@/lib/utils";
import NarrowContainer from "../NarrowContainer";
import ClippedSVG from "../ClippedSVG";
import Axis from "../Axis";
import AxisLabel from "../AxisLabel";
import { paddingObj } from "@/utils/styles";

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
  tickStep,
  tickStepX,
  tickStepY,
  xAxisPosition = "bottom",
  yAxisPosition = "left",
  yLabelSide = "left",
  yAxisOnTop = false,
  xLabel = "",
  xScale,
  yLabel = "",
  yLabelOffset = 0,
  yScale,
  className,
}: GraphProps<XDomain, YDomain>) => {
  const gPadding = paddingObj(graphPadding) as Padding;
  const options = getLabelOptions(width, height, gPadding, gridlinesHorizontal, gridlinesVertical, yLabelOffset);
  
  const xOptions = options.x[xAxisPosition];
  const yOptions = options.y[yAxisPosition];

  // Type-safe tick step calculation
  const calculatedTickStepY = (tickStepY ? tickStepY(yScale) : (tickStep ? tickStep(yScale as AxisScale<XDomain | YDomain>) : undefined));
  const calculatedTickStepX = (tickStepX ? tickStepX(xScale) : (tickStep ? tickStep(xScale as AxisScale<XDomain | YDomain>) : undefined));

  return (
    <NarrowContainer width="100%" className={className}>
      <ClippedSVG id={svgId} width={width} height={height} padding={svgPadding}>
        {!yAxisOnTop && (
          <Axis
            key="y-axis"
            direction="y"
            labelPosition={yLabelSide === "right" ? { x: "4", dy: "12" } : { x: "-3", dy: "0.32em" }}
            scale={yScale}
            textAnchor={yLabelSide === "right" ? "start" : "end"}
            tickSize={yOptions.tickSize}
            tickShift={yOptions.tickShift}
            tickStep={calculatedTickStepY}
            tickFormat={tickFormatY}
            xShift={yOptions.xShift}
          />
        )}
        <Axis
          key="x-axis"
          direction="x"
          labelPosition={{ y: "0.35em", x: "9", dy: "0" }}
          rotateLabels
          scale={xScale}
          textAnchor="start"
          tickSize={xOptions.tickSize}
          tickShift={xOptions.tickShift}
          tickStep={calculatedTickStepX}
          tickFormat={tickFormatX}
          yShift={xOptions.yShift}
        />
        <line
          x1={yOptions.xShift}
          x2={yOptions.xShift}
          y1={gPadding.top}
          y2={height - gPadding.bottom}
          stroke="#000"
          strokeWidth="1"
        />
        {children}
        {yAxisOnTop && (
          <Axis
            key="y-axis"
            direction="y"
            labelPosition={yLabelSide === "right" ? { x: "4", dy: "12" } : { x: "-3", dy: "0.32em" }}
            scale={yScale}
            textAnchor={yLabelSide === "right" ? "start" : "end"}
            tickSize={yOptions.tickSize}
            tickShift={yOptions.tickShift}
            tickStep={calculatedTickStepY}
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
  );
};

function getLabelOptions(width: number, height: number, padding: Padding, hGrid: boolean, vGrid: boolean, yOff: number) {
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
