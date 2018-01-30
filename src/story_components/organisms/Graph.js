import React from "react";
import PropTypes from "prop-types";
import Axis from "../molecules/Axis";
import StyledAxisLabel from "../atoms/StyledAxisLabel";
import StyledGraph from "../atoms/StyledGraph";
import ClippedSVG from "../atoms/ClippedSVG";
import { range } from "d3-array";

const Graph = ({
  width,
  height,
  padding,
  svgId,
  double,
  xLabel,
  yLabel,
  xScale,
  yScale,
  children
}) => {
  const tickValues = scale => {
    const tickMin = scale.domain()[0];
    const tickMax = scale.domain()[1];
    const step = tickMax > 500 ? (tickMax - tickMin) / 1e3 : 1;
    return range(tickMin, tickMax + step, step);
  };

  return (
    <StyledGraph double={double}>
      <ClippedSVG id={svgId} width={width} height={height} padding={padding}>
        <Axis
          direction="y"
          scale={yScale}
          xShift={padding}
          tickSize={-width + 2 * padding}
          tickValues={tickValues(yScale)}
        />
        <Axis
          direction="x"
          scale={xScale}
          yShift={height / 2}
          tickSize={-height + 2 * padding}
          tickShift={height / 2 - padding}
          tickValues={tickValues(xScale)}
        />
        {children}
        <StyledAxisLabel x={width} y={height / 2} dy={30} dx={-60}>
          {xLabel}
        </StyledAxisLabel>
        <StyledAxisLabel
          x={10}
          y={height / 2}
          transform={`rotate(-90 10,${height / 2})`}
          dy={10}
        >
          {yLabel}
        </StyledAxisLabel>
      </ClippedSVG>
    </StyledGraph>
  );
};

Graph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  svgId: PropTypes.string.isRequired,
  double: PropTypes.bool.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired
};

Graph.defaultProps = {
  double: false
};

export default Graph;
