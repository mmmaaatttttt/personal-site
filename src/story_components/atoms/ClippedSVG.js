import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";

const StyledSVG = styled.svg`
  ${props =>
    css`
      border: ${props.borderWidth} solid ${props.borderColor};
      border-radius: ${props.borderWidth};
    `};
`;

const ClippedSVG = ({
  id,
  width,
  height,
  padding,
  children,
  borderWidth,
  borderColor
}) => (
  <StyledSVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox={`0 0 ${width} ${height}`}
    borderWidth={borderWidth}
    borderColor={borderColor}
  >
    <defs>
      <clipPath id={`clip-path-${id}`}>
        <rect
          x={0}
          y={padding}
          height={height - 2 * padding}
          width={width - padding}
        />
      </clipPath>
    </defs>
    <g clipPath={`url(#clip-path-${id})`}>{children}</g>
  </StyledSVG>
);

ClippedSVG.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.string
};

ClippedSVG.defaultProps = {
  padding: 0
};

export default ClippedSVG;
