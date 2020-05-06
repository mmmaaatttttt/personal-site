import React from "react";
import styled, { css, keyframes } from "styled-components";
import PropTypes from "prop-types";
import { CenteredSVGText } from "story_components";
import COLORS from "utils/styles";
import { noop } from "utils/fnHelpers";

// pulse inspiration:
// https://codepen.io/riccardoscalco/pen/GZzZRz
const pulse = props => keyframes`
  from {
    stroke-width: 0;
    stroke-opacity: 1;
  }

  to {
    stroke-width: ${3 * props.r}px;
    stroke-opacity: 0;
  }
`;

const StyledCircle = styled.circle`
  ${props =>
    props.isActive &&
    css`
      animation: ${pulse(props)} 2s infinite;
    `}
`;
function LabeledCircle({
  color = COLORS.DARK_GRAY,
  handleLeave = noop,
  handleUpdate = noop,
  isActive = false,
  label = "",
  x = 0,
  y = 0,
  r = 10
}) {
  return (
    <g
      onMouseMove={handleUpdate}
      onTouchMove={handleUpdate}
      onMouseLeave={handleLeave}
      onTouchEnd={handleLeave}
    >
      <StyledCircle
        isActive={isActive}
        cx={x}
        cy={y}
        fill={color}
        r={r}
        stroke={color}
      />
      <CenteredSVGText x={x} y={y} fontSize={`${1.5 * r}px`} baseline="central">
        {label}
      </CenteredSVGText>
    </g>
  );
}

LabeledCircle.propTypes = {
  color: PropTypes.string,
  handleLeave: PropTypes.func,
  handleUpdate: PropTypes.func,
  isActive: PropTypes.bool,
  label: PropTypes.string,
  r: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number
};

export default React.memo(LabeledCircle);
