import React from "react";
import PropTypes from "prop-types";
import StyledSliderTick from "../atoms/StyledSliderTick";
import StyledFlexContainer from "../atoms/StyledFlexContainer";

const SliderTicks = ({
  count,
  fractionFilled,
  activeColor,
  inactiveColor,
  height,
  padding
}) => {
  const ticks = Array.from({ length: count }, (e, i) => {
    const color =
      i / (count - 1) <= fractionFilled ? activeColor : inactiveColor;
    return (
      <StyledSliderTick key={i} color={color} width={height} offset={padding} />
    );
  });
  return (
    <StyledFlexContainer main="space-between">{ticks}</StyledFlexContainer>
  );
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
