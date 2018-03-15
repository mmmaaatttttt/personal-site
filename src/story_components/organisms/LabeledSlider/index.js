import React from "react";
import PropTypes from "prop-types";
import { lighten } from "polished";
import styled from "styled-components";
import COLORS from "utils/styles";
import { Icon, SliderTicks, StyledSlider } from "story_components";

const StyledSliderTitle = styled.p`
  margin-bottom: ${rhythm(0.25)};
  font-size: 80%;
  line-height: 1;
`;

const StyledSliderArea = styled.div`
  text-align: center;
  flex: 1;
  width: 100%;

  section {
    display: flex;
    align-items: center;
  }
`;

const StyledIconWrapper = styled.p`
  margin: 0 ${rhythm(0.5)};
  line-height: 1;
`;

const LabeledSlider = ({
  min,
  max,
  step,
  value,
  handleValueChange,
  title,
  color,
  sliderHeight,
  sliderPadding,
  tickCount,
  minIcon,
  maxIcon,
  fadeIcons
}) => {
  const fraction = (value - min) / (max - min);
  step = step || (max - min) / 100;
  const leftOpacity = fadeIcons ? 1 - fraction : 1;
  const rightOpacity = fadeIcons ? fraction : 1;
  return (
    <StyledSliderArea>
      <StyledSliderTitle>{title}</StyledSliderTitle>
      <section>
        <StyledIconWrapper>
          <Icon name={minIcon} color={color} opacity={leftOpacity} disabled />
        </StyledIconWrapper>
        <StyledSlider
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={handleValueChange}
          activeColor={lighten(0.2, color)}
          height={sliderHeight}
          padding={sliderPadding}
        >
          <SliderTicks
            count={tickCount}
            fractionFilled={fraction}
            activeColor={lighten(0.2, color)}
            height={sliderHeight}
            padding={sliderPadding}
          />
        </StyledSlider>
        <StyledIconWrapper>
          <Icon name={maxIcon} color={color} opacity={rightOpacity} />
        </StyledIconWrapper>
      </section>
    </StyledSliderArea>
  );
};

LabeledSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  value: PropTypes.number.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  sliderHeight: PropTypes.number.isRequired,
  sliderPadding: PropTypes.number.isRequired,
  tickCount: PropTypes.number.isRequired,
  minIcon: PropTypes.string.isRequired,
  maxIcon: PropTypes.string.isRequired,
  fadeIcons: PropTypes.bool.isRequired
};

LabeledSlider.defaultProps = {
  min: 0,
  max: 100,
  value: 0,
  handleValueChange: val => console.log(val),
  title: "Temporary Title",
  color: COLORS.ORANGE,
  sliderHeight: 6,
  sliderPadding: 10,
  tickCount: 3,
  minIcon: "minus",
  maxIcon: "plus",
  fadeIcons: true
};

export default LabeledSlider;
