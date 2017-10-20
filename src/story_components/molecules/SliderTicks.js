import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import StyledSliderTick from "../atoms/StyledSliderTick";

const StyledTickContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 100%;
`;

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
  return <StyledTickContainer>{ticks}</StyledTickContainer>;
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
