import React, { useState } from "react";
import styled from "styled-components";
import Measure from "react-measure";
import PropTypes from "prop-types";
import { SVGContext } from "contexts";

const StyledSVG = styled.svg`
  margin-top: ${props => props.marginTop};
`;

const ClippedSVG = ({ id, width, height, marginTop, padding, children }) => {
  const [dimensions, setDimensions] = useState({
    bottom: 0,
    left: 0,
    top: 0,
    right: 0,
    width: 0,
    height: 0
  });
  if (typeof padding === "number") {
    padding = {
      top: padding,
      left: 0,
      right: padding,
      bottom: padding
    };
  }
  return (
    <Measure
      bounds
      onResize={contentRect => setDimensions(contentRect.bounds)}
    >
      {({ measureRef }) => (
        <div ref={measureRef}>
          <SVGContext.Provider value={{ width, height, padding, dimensions }}>
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
          </SVGContext.Provider>
        </div>
      )}
    </Measure>
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
