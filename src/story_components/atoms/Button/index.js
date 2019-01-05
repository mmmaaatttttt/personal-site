import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { darken } from "polished";

const color = props => props.color;
const darkerColor = props => darken(0.1, color(props));

const Button = styled.button`
  border-radius: 3px;
  box-sizing: border-box;
  padding: 0.2rem 0.6rem;
  background-color: ${color};
  border: 1px solid ${color};
  color: white;
  font-size: 80%;
  line-height: 1.4rem;
  margin: 0.5rem;

  &:active,
  &:focus {
    outline: none;
  }

  &:hover {
    cursor: pointer;
    background-color: ${darkerColor};
  }

  ${props =>
    props.large &&
    css`
      width: 100%;
      padding: 0.5rem 0.6rem;
      margin: 0.5rem 0;
    `}

  ${props =>
    props.color === "white" &&
    css`
      color: black;
      border: 1px solid black;
    `} ${props =>
  props.disabled &&
  css`
    opacity: 0.7;

    &:hover {
      cursor: not-allowed;
    }
  `};
`;

Button.propTypes = {
  color: PropTypes.string.isRequired,
  large: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired
};

Button.defaultProps = {
  color: "white",
  large: false,
  disabled: false
};

export default Button;
