import React from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import { Axis, AxisLabel, ClippedSVG, NarrowContainer } from "story_components";
import { svgProps, svgDefaultProps, paddingType } from "utils/types";
import { paddingObj } from "utils/styles";

const Graph = ({
  children,
  graphPadding,
  gridlinesHorizontal,
  gridlinesVertical,
  height,
  svgId,
  svgPadding,
  tickFormatX,
  tickFormatY,
  tickStep,
  width,
  xAxisPosition,
  xLabel,
  xScale,
  yAxisPosition,
  yLabel,
  yLabelOffset,
  yScale
}) => {
  graphPadding = paddingObj(graphPadding);
  const { x, y } = labelOptions(
    width,
    height,
    graphPadding,
    gridlinesHorizontal,
    gridlinesVertical,
    yLabelOffset
  );
  const xOptions = x[xAxisPosition];
  const yOptions = y[yAxisPosition];
  return (
    <NarrowContainer width="100%">
      <ClippedSVG id={svgId} width={width} height={height} padding={svgPadding}>
        <Axis
          direction="y"
          labelPosition={{ x: "-3", dy: "0.32em" }}
          scale={yScale}
          textAnchor="end"
          tickSize={yOptions.tickSize}
          tickShift={yOptions.tickShift}
          tickStep={tickStep && tickStep(yScale)}
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
          tickStep={tickStep && tickStep(xScale)}
          tickFormat={tickFormatX}
          yShift={xOptions.yShift}
        />
        <line
          x1={yOptions.xShift}
          x2={yOptions.xShift}
          y1={graphPadding.top}
          y2={height - graphPadding.bottom}
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

const labelOptions = (width, height, padding, hGrid, vGrid, yOff) => {
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
          anchor: "middle"
        }
      },
      center: {
        yShift: height / 2,
        tickSize: xTickSize,
        tickShift: (height - top - bottom) / 2,
        label: {
          x: width,
          y: height / 2,
          anchor: "end",
          dx: -(left + right) / 2,
          dy: (top + bottom) / 2
        }
      }
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
          dy: 10
        }
      },
      center: {
        xShift: width / 2,
        tickSize: yTickSize,
        tickShift: (-width + left + right) / 2,
        label: {
          x: width / 2,
          y: 10,
          dx: 10,
          dy: 10
        }
      }
    }
  };
};

Graph.propTypes = {
  ...svgProps,
  graphPadding: paddingType,
  gridlinesHorizontal: PropTypes.bool.isRequired,
  gridlinesVertical: PropTypes.bool.isRequired,
  svgPadding: paddingType,
  svgId: PropTypes.string.isRequired,
  tickFormatX: PropTypes.string.isRequired,
  tickFormatY: PropTypes.string.isRequired,
  tickStep: PropTypes.func,
  xLabel: PropTypes.string.isRequired,
  xAxisPosition: PropTypes.oneOf(["bottom", "center"]),
  yAxisPosition: PropTypes.oneOf(["left", "center"]),
  yLabel: PropTypes.string.isRequired,
  yLabelOffset: PropTypes.number.isRequired
};

Graph.defaultProps = {
  ...svgDefaultProps,
  graphPadding: 0,
  gridlinesHorizontal: true,
  gridlinesVertical: true,
  svgId: "svg",
  svgPadding: 0,
  tickFormatX: "",
  tickFormatY: "",
  xAxisPosition: "bottom",
  yAxisPosition: "left",
  xLabel: "",
  xScale: scaleLinear()
    .domain([-10, 10])
    .range([0, svgDefaultProps.width]),
  yLabel: "",
  yLabelOffset: 0,
  yScale: scaleLinear()
    .domain([-10, 10])
    .range([svgDefaultProps.height, 0])
};

export default Graph;
