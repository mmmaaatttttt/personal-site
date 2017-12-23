import React from "react";
import PropTypes from "prop-types";
import { lighten } from "polished";
import SliderTicks from "../molecules/SliderTicks";
import SliderIcon from "../atoms/SliderIcon";
import StyledSlider from "../atoms/StyledSlider";
import StyledIconWrapper from "../atoms/StyledIconWrapper";
import StyledSliderTitle from "../atoms/StyledSliderTitle";
import StyledSliderArea from "../atoms/StyledSliderArea";
import COLORS from "../../utils/styles";

const LabeledSlider = ({
  min,
  max,
  value,
  handleValueChange,
  title,
  color,
  sliderHeight,
  sliderPadding,
  double
}) => {
  const fraction = (value - min) / (max - min);
  return (
    <StyledSliderArea double={double}>
      <StyledSliderTitle>{title}</StyledSliderTitle>
      <section>
        <StyledIconWrapper>
          <SliderIcon name="minus" color={color} opacity={1 - fraction} />
        </StyledIconWrapper>
        <StyledSlider
          min={min}
          max={max}
          value={value}
          step={(max - min) / 100}
          onChange={handleValueChange}
          activeColor={lighten(0.2, color)}
          height={sliderHeight}
          padding={sliderPadding}
        >
          <SliderTicks
            count={3}
            fractionFilled={fraction}
            activeColor={lighten(0.2, color)}
            height={sliderHeight}
            padding={sliderPadding}
          />
        </StyledSlider>
        <StyledIconWrapper>
          <SliderIcon name="plus" color={color} opacity={fraction} />
        </StyledIconWrapper>
      </section>
    </StyledSliderArea>
  );
};

LabeledSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  sliderHeight: PropTypes.number.isRequired,
  sliderPadding: PropTypes.number.isRequired,
  double: PropTypes.bool
};

LabeledSlider.defaultProps = {
  sliderHeight: 6,
  sliderPadding: 10,
  color: COLORS.ORANGE
};

export default LabeledSlider;
