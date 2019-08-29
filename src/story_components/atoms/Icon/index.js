import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const StyledIcon = styled.i`
  padding: ${props => props.padding};
  ${props =>
    props.disabled &&
    css`
      &:hover {
        cursor: not-allowed;
      }
    `};
  ${props =>
    props.hover &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}
`;

const Icon = ({
  color,
  disabled,
  hover,
  name,
  onClick,
  opacity,
  padding,
  size,
  type
}) => (
  <StyledIcon
    className={`fa${type[0]} fa-${name} fa-${size}x`}
    onClick={onClick}
    style={{ color, opacity }}
    disabled={disabled}
    hover={hover}
    padding={padding}
  />
);

Icon.propTypes = {
  color: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  hover: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  opacity: PropTypes.number.isRequired,
  padding: PropTypes.string.isRequired,
  size: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired,
  type: PropTypes.oneOf(["solid", "regular", "light", "brands"]).isRequired
};

Icon.defaultProps = {
  color: "#000",
  disabled: false,
  hover: false,
  name: "check",
  opacity: 1,
  padding: "0",
  size: 1,
  type: "solid"
};

export default Icon;
