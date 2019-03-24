import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Axis, AxisLabel, ClippedSVG } from "story_components";

const FullWidth = styled.div`
  width: 100%;
`;

const Graph = ({
  children,
  graphPadding,
  height,
  svgId,
  svgPadding,
  tickFormatX,
  tickFormatY,
  tickStep,
  width,
  xLabelPosition,
  xLabel,
  xScale,
  yLabel,
  yLabelOffset,
  yScale
}) => {
  if (typeof graphPadding === "number") {
    graphPadding = {
      top: graphPadding,
      left: graphPadding,
      right: graphPadding,
      bottom: graphPadding
    };
  }
  const labelOptions = {
    x: {
      "center-right": {
        yShift: height / 2,
        tickSize: -height + graphPadding.top + graphPadding.bottom,
        tickShift: (-height + graphPadding.top + graphPadding.bottom) / 2,
        label: {
          x: width,
          y: height / 2,
          anchor: "end",
          dx: -(graphPadding.left + graphPadding.right) / 2,
          dy: (graphPadding.top + graphPadding.bottom) / 2
        }
      },
      "bottom-center": {
        yShift: height - graphPadding.bottom,
        tickShift: 0,
        label: {
          x: width / 2,
          y: height - graphPadding.bottom,
          dx: 0,
          dy: graphPadding.bottom * 0.7,
          anchor: "middle"
        }
      }
    }
  };
  const xOptions = labelOptions.x[xLabelPosition];
  return (
    <FullWidth>
      <ClippedSVG id={svgId} width={width} height={height} padding={svgPadding}>
        <Axis
          direction="y"
          labelPosition={{ x: "-3", dy: "0.32em" }}
          scale={yScale}
          textAnchor="end"
          tickSize={-width + graphPadding.left + graphPadding.right}
          tickStep={tickStep && tickStep(yScale)}
          tickFormat={tickFormatY}
          xShift={graphPadding.left}
        />
        <Axis
          direction="x"
          labelPosition={{ y: "0.35em", x: "9", dy: "0" }}
          rotateLabels
          scale={xScale}
          textAnchor="start"
          tickSize={-height + graphPadding.top + graphPadding.bottom}
          tickShift={xOptions.tickShift}
          tickStep={tickStep && tickStep(xScale)}
          tickFormat={tickFormatX}
          yShift={xOptions.yShift}
        />
        <line
          x1={graphPadding.left}
          x2={graphPadding.left}
          y1={graphPadding.top}
          y2={height - graphPadding.bottom}
          stroke="#000"
          strokeWidth="1"
        />
        {children}
        <AxisLabel {...xOptions.label}>{xLabel}</AxisLabel>
        <AxisLabel
          x={10}
          y={height / 2}
          transform={`rotate(-90 10,${height / 2})`}
          dy={10}
          dx={yLabelOffset}
        >
          {yLabel}
        </AxisLabel>
      </ClippedSVG>
    </FullWidth>
  );
};

Graph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  graphPadding: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number
    })
  ]).isRequired,
  svgPadding: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number
    })
  ]).isRequired,
  svgId: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  xLabelPosition: PropTypes.oneOf(["bottom-center", "center-right"]),
  yLabel: PropTypes.string.isRequired,
  yLabelOffset: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  tickStep: PropTypes.func,
  tickFormatX: PropTypes.string.isRequired,
  tickFormatY: PropTypes.string.isRequired
};

Graph.defaultProps = {
  svgPadding: 0,
  graphPadding: 0,
  tickFormatX: "",
  tickFormatY: "",
  xLabel: "",
  xLabelPosition: "bottom-center",
  yLabel: "",
  yLabelOffset: 0
};

export default Graph;
