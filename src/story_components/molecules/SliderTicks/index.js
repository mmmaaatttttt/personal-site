import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { StyledSliderTick, FlexContainer } from "story_components";

const StyledSliderTick = styled.div`
  position: relative;
  width: ${props => props.width}px;
  background-color: ${props => props.color};
  top: -${props => props.offset}px;
  height: ${props => 2 * props.offset + props.width}px;
  z-index: -1;
  border-radius: ${props => props.width}px;
`;

const SliderTicks = ({
  count,
  fractionFilled,
  activeColor,
  inactiveColor,
  height,
  padding
}) => {
  const ticks = Array.from({ length: count }, (_, i) => {
    const color =
      i / (count - 1) <= fractionFilled ? activeColor : inactiveColor;
    return (
      <StyledSliderTick key={i} color={color} width={height} offset={padding} />
    );
  });
  return <FlexContainer main="space-between">{ticks}</FlexContainer>;
};

SliderTicks.propTypes = {
  count: PropTypes.number.isRequired,
  fractionFilled: PropTypes.number.isRequired,
  activeColor: PropTypes.string.isRequired,
  inactiveColor: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired
};

SliderTicks.defaultProps = {
  activeColor: "#abe2fb",
  inactiveColor: "#e9e9e9"
};

export default SliderTicks;
