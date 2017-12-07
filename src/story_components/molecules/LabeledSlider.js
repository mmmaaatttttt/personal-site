import React from "react";
import PropTypes from "prop-types";
import StyledSlider from "../atoms/StyledSlider";
import styled, { css } from "styled-components";
import { rhythm } from "../../utils/typography";
import { lighten } from "polished";
import SliderTicks from "./SliderTicks";
import Icon from "../atoms/icon";

const StyledIconWrapper = styled.p`
  margin: 0 ${rhythm(0.5)};
  line-height: 1;
`;

const StyledSliderArea = styled.div`
  text-align: center;

  section {
    display: flex;
    align-items: center;
  }

  ${props =>
    props.double &&
    css`
      width: 50%;
    `};
`;

const StyledTitle = styled.p`
  margin-bottom: ${rhythm(0.25)};
  font-size: 80%;
  line-height: 1;
`

const LabeledSlider = ({
  idx,
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
      <StyledTitle>{title}</StyledTitle>
      <section>
        <StyledIconWrapper>
          <Icon name="minus" color={color} opacity={1 - fraction} />
        </StyledIconWrapper>
        <StyledSlider
          min={min}
          max={max}
          value={value}
          step={(max - min) / 100}
          onChange={v => handleValueChange(idx, v)}
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
          <Icon name="plus" color={color} opacity={fraction} />
        </StyledIconWrapper>
      </section>
    </StyledSliderArea>
  );
};

LabeledSlider.propTypes = {
  idx: PropTypes.number.isRequired,
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
  sliderPadding: 10
};

export default LabeledSlider;
