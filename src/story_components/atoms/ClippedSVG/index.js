import styled, { css } from "styled-components";
import PropTypes from "prop-types";

const StyledSVG = styled.svg`
  display: block;
`;

const ClippedSVG = ({ id, width, height, padding, children }) => (
  <StyledSVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox={`0 0 ${width} ${height}`}
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
  padding: PropTypes.number.isRequired
};

ClippedSVG.defaultProps = {
  padding: 0
};

export default ClippedSVG;
