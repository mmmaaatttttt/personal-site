import styled from "styled-components";
import PropTypes from "prop-types";

const ColoredSpan = styled.span`
  color: ${props => props.color};
  font-weight: ${props => props.bold ? "bold" : "normal"};
`;

ColoredSpan.propTypes = {
  bold: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired
};

ColoredSpan.defaultProps = {
  bold: false,
  color: "black"
};

export default ColoredSpan;
