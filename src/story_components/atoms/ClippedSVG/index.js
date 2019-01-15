import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledSVG = styled.svg`
  display: block;
  margin-top: ${props => props.marginTop};
`;

const ClippedSVG = ({ id, width, height, marginTop, padding, children }) => {
  if (typeof padding === "number") {
    padding = {
      top: padding,
      left: 0,
      right: padding,
      bottom: padding
    };
  }
  return (
    <StyledSVG
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      marginTop={marginTop}
    >
      <defs>
        <clipPath id={`clip-path-${id}`}>
          <rect
            x={padding.left}
            y={padding.top}
            height={height - padding.top - padding.bottom}
            width={width - padding.left - padding.right}
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-path-${id})`}>{children}</g>
    </StyledSVG>
  );
};

ClippedSVG.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  marginTop: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  padding: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number
    })
  ]).isRequired
};

ClippedSVG.defaultProps = {
  height: 600,
  id: "svg",
  marginTop: 0,
  padding: 0,
  width: 600
};

export default ClippedSVG;
