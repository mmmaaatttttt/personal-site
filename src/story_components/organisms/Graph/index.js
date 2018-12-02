import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Axis, AxisLabel, ClippedSVG } from "story_components";

const FullWidth = styled.div`
  width: 100%;
`;

const Graph = ({
  width,
  height,
  graphPadding,
  svgPadding,
  svgId,
  xLabel,
  yLabel,
  xLabelPosition,
  xScale,
  yScale,
  children,
  tickStep,
  tickFormatX,
  tickFormatY
}) => {
  const labelOptions = {
    x: {
      "center-right": {
        yShift: height / 2,
        tickSize: -height + 2 * graphPadding,
        tickShift: height / 2 - graphPadding,
        label: {
          x: width,
          y: height / 2,
          anchor: "end",
          dx: -graphPadding,
          dy: graphPadding
        }
      },
      "bottom-center": {
        yShift: height - graphPadding,
        tickShift: 0,
        label: {
          x: width / 2,
          y: height - graphPadding,
          dx: 0,
          dy: graphPadding * 0.7,
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
          labelPosition={{x: "-3", dy: "0.32em"}}
          scale={yScale}
          textAnchor="end"
          tickSize={-width + 2 * graphPadding}
          tickStep={tickStep && tickStep(yScale)}
          tickFormat={tickFormatY}
          xShift={graphPadding}
        />
        <Axis
          direction="x"
          labelPosition={{y: "0.35em", x: "9", dy: "0"}}
          rotateLabels
          scale={xScale}
          textAnchor="start"
          tickSize={-height + 2 * graphPadding}
          tickShift={xOptions.tickShift}
          tickStep={tickStep && tickStep(xScale)}
          tickFormat={tickFormatX}
          yShift={xOptions.yShift}
        />
        <line
          x1={graphPadding}
          x2={graphPadding}
          y1={graphPadding}
          y2={height - graphPadding}
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
  graphPadding: PropTypes.number.isRequired,
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
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  tickStep: PropTypes.func,
  tickFormatX: PropTypes.string.isRequired,
  tickFormatY: PropTypes.string.isRequired
};

Graph.defaultProps = {
  tickFormatX: "",
  tickFormatY: "",
  xLabelPosition: "bottom-center",
  svgPadding: 0
};

export default Graph;
