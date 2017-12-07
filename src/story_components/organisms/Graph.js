import React from "react";
import PropTypes from "prop-types";
import Axis from "../molecules/Axis";
import StyledAxisLabel from "../atoms/StyledAxisLabel";
import styled, { css } from "styled-components";
import media from "../../utils/media";

const StyledGraph = styled.div`
  width: 50%;

  ${props =>
    !props.double &&
    css`
      ${media.small`
        width: 100%;
      `};
    `};
`;

const Graph = ({ width, height, padding, svgId, double, xLabel, yLabel, xScale, yScale, children}) => (
  <StyledGraph double={double}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <clipPath id={`clip-path-${svgId}`}>
          <rect
            x={0}
            y={padding}
            height={height - 2 * padding}
            width={width - padding}
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-path-${svgId})`}>
        <Axis
          direction="y"
          scale={yScale}
          xShift={padding}
          tickSize={-width + 2 * padding}
        />
        <Axis
          direction="x"
          scale={xScale}
          yShift={height / 2}
          tickSize={-height + 2 * padding}
          tickShift={height / 2 - padding}
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
      </g>
    </svg>
  </StyledGraph>
);

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
}

export default Graph;
