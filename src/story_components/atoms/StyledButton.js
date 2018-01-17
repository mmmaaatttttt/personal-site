import styled from "styled-components";
import PropTypes from "prop-types";
import { darken } from "polished";
import COLORS from "../../utils/styles";
import { rhythm } from "../../utils/typography";

const color = props => props.color;
const darkerColor = props => darken(0.1, color(props));

const StyledButton = styled.button`
  border-radius: 3px;
  padding: 0.2rem 0.6rem;
  background-color: ${color};
  border: none;
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
`;

StyledButton.propTypes = {
  color: PropTypes.string.isRequired
};

StyledButton.defaultProps = {
  color: "orange"
};

export default StyledButton;
