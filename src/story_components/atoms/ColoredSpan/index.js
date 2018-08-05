import styled, { css } from "styled-components";
import PropTypes from "prop-types";

const ColoredSpan = styled.span`
  color: ${props => props.color};
`;

ColoredSpan.propTypes = {
  color: PropTypes.string.isRequired
};

ColoredSpan.defaultProps = {
  color: "black"
};

export default ColoredSpan;
