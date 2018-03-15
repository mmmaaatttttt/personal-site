import React from "react";
import PropTypes from "prop-types";
import { Axis, AxisLabel, ClippedSVG } from "story_components";

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
    <div>
      <ClippedSVG id={svgId} width={width} height={height} padding={svgPadding}>
        <Axis
          direction="y"
          scale={yScale}
          xShift={graphPadding}
          tickSize={-width + 2 * graphPadding}
          tickStep={tickStep && tickStep(yScale)}
          tickFormat={tickFormatY}
        />
        <Axis
          direction="x"
          scale={xScale}
          yShift={xOptions.yShift}
          tickSize={-height + 2 * graphPadding}
          tickShift={xOptions.tickShift}
          tickStep={tickStep && tickStep(xScale)}
          tickFormat={tickFormatX}
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
    </div>
  );
};

Graph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  graphPadding: PropTypes.number.isRequired,
  svgPadding: PropTypes.number.isRequired,
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
