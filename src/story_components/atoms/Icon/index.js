import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const StyledIcon = styled.i`
  ${props =>
    props.disabled &&
    css`
      &:hover {
        cursor: not-allowed;
      }
    `};
`;

const Icon = ({ name, color, opacity, disabled, size, type }) => (
  <StyledIcon
    className={`fa${type[0]} fa-${name} fa-${size}x`}
    style={{ color, opacity }}
    disabled={disabled}
  />
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired,
  size: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired,
  disabled: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(["solid", "regular", "light", "brands"]).isRequired
};

Icon.defaultProps = {
  color: "#000",
  disabled: false,
  name: "check",
  opacity: 1,
  size: 1,
  type: "solid"
};

export default Icon;
