import React, { Component } from "react";
import styled, { css, keyframes } from "styled-components";
import PropTypes from "prop-types";
import { CenteredSVGText } from "story_components";
import COLORS from "utils/styles";

// pulse inspiration:
// https://codepen.io/riccardoscalco/pen/GZzZRz
const pulse = props => keyframes`
  from {
    stroke-width: 0;
    stroke-opacity: 1;
  }

  to {
    stroke-width: ${3*props.r}px;
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
class LabeledCircle extends Component {
  render() {
    const {
      x,
      y,
      color,
      label,
      isActive,
      r,
      handleLeave,
      handleUpdate
    } = this.props;
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
        <CenteredSVGText x={x} y={y} fontSize={`${1.5*r}px`}>
          {label}
        </CenteredSVGText>
      </g>
    );
  }
}

LabeledCircle.propTypes = {
  color: PropTypes.string.isRequired,
  handleLeave: PropTypes.func,
  handleUpdate: PropTypes.func,
  isActive: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  r: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};

LabeledCircle.defaultProps = {
  color: COLORS.DARK_GRAY,
  isActive: false,
  label: "",
  x: 0,
  y: 0,
  r: 10
};

export default LabeledCircle;
