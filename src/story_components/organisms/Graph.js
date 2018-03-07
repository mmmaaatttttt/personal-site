import React from "react";
import PropTypes from "prop-types";
import Axis from "../molecules/Axis";
import StyledAxisLabel from "../atoms/StyledAxisLabel";
import ClippedSVG from "../atoms/ClippedSVG";

const Graph = ({
  width,
  height,
  padding,
  svgId,
  xLabel,
  yLabel,
  xScale,
  yScale,
  children,
  tickStep
}) => {
  return (
    <div>
      <ClippedSVG id={svgId} width={width} height={height} padding={padding}>
        <Axis
          direction="y"
          scale={yScale}
          xShift={padding}
          tickSize={-width + 2 * padding}
          tickStep={tickStep && tickStep(yScale)}
        />
        <Axis
          direction="x"
          scale={xScale}
          yShift={height / 2}
          tickSize={-height + 2 * padding}
          tickShift={height / 2 - padding}
          tickStep={tickStep && tickStep(xScale)}
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
    </div>
  );
};

Graph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  svgId: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  tickStep: PropTypes.func
};

export default Graph;
