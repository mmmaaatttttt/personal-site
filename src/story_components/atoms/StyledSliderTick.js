import PropTypes from "prop-types";
import styled from "styled-components";

const StyledSliderTick = styled.div`
  position: relative;
  width: ${props => props.width}px;
  background-color: ${props => props.color};
  top: -${props => props.offset}px;
  height: ${props => 2 * props.offset + props.width}px;
  z-index: -1;
  border-radius: ${props => props.width}px;
`;

StyledSliderTick.propTypes = {
  color: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired
};

export default StyledSliderTick;
