import React from "react";
import { cn } from "@/lib/utils";
import NarrowContainer from "./NarrowContainer";
import ClippedSVG from "./ClippedSVG";
import Axis from "./Axis";
import AxisLabel from "./AxisLabel";
import { paddingObj } from "@/utils/styles";

interface GraphProps {
  children?: React.ReactNode;
  graphPadding?: number | { top: number; bottom: number; left: number; right: number };
  gridlinesHorizontal?: boolean;
  gridlinesVertical?: boolean;
  height?: number;
  width?: number;
  svgId?: string;
  svgPadding?: number | { top: number; bottom: number; left: number; right: number };
  tickFormatX?: string;
  tickFormatY?: string;
  tickStep?: (scale: any) => number;
  tickStepX?: (scale: any) => number;
  tickStepY?: (scale: any) => number;
  xAxisPosition?: "bottom" | "center";
  yAxisPosition?: "left" | "center";
  xLabel?: string;
  xScale: any;
  yLabel?: string;
  yLabelOffset?: number;
  yScale: any;
  className?: string;
}

const Graph: React.FC<GraphProps> = ({
  children,
  graphPadding = 0,
  gridlinesHorizontal = true,
  gridlinesVertical = true,
  height = 600,
  width = 600,
  svgId = "svg",
  svgPadding = 0,
  tickFormatX = "",
  tickFormatY = "",
  tickStep,
  tickStepX,
  tickStepY,
  xAxisPosition = "bottom",
  yAxisPosition = "left",
  xLabel = "",
  xScale,
  yLabel = "",
  yLabelOffset = 0,
  yScale,
  className,
}) => {
  const gPadding = paddingObj(graphPadding);
  const options = getLabelOptions(width, height, gPadding, gridlinesHorizontal, gridlinesVertical, yLabelOffset);
  
  const xOptions = options.x[xAxisPosition];
  const yOptions = options.y[yAxisPosition];

  return (
    <NarrowContainer width="100%" className={className}>
      <ClippedSVG id={svgId} width={width} height={height} padding={svgPadding}>
        <Axis
          direction="y"
          labelPosition={{ x: "-3", dy: "0.32em" }}
          scale={yScale}
          textAnchor="end"
          tickSize={yOptions.tickSize}
          tickShift={yOptions.tickShift}
          tickStep={(tickStepY || tickStep)?.(yScale)}
          tickFormat={tickFormatY}
          xShift={yOptions.xShift}
        />
        <Axis
          direction="x"
          labelPosition={{ y: "0.35em", x: "9", dy: "0" }}
          rotateLabels
          scale={xScale}
          textAnchor="start"
          tickSize={xOptions.tickSize}
          tickShift={xOptions.tickShift}
          tickStep={(tickStepX || tickStep)?.(xScale)}
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

function getLabelOptions(width: number, height: number, padding: any, hGrid: boolean, vGrid: boolean, yOff: number) {
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
