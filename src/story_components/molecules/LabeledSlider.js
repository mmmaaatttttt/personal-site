import React from "react";
import PropTypes from "prop-types";
import StyledSlider from "../atoms/StyledSlider";
import styled, { css } from "styled-components";
import { rhythm } from "../../utils/typography";
import { lighten } from "polished";
import SliderTicks from "./SliderTicks";
import Icon from "../atoms/icon";

const orderFromId = id => {
  const nums = id.split("|").map(Number);
  return nums[0] + 2 * nums[1] + 1;
};

const StyledSliderArea = styled.div`
  text-align: center;

  p {
    margin: 0 ${rhythm(0.5)};
  }

  section {
    display: flex;
    align-items: center;
  }

  ${props =>
    props.double &&
    css`
      width: 50%;
      order: ${props => orderFromId(props.id)};
    `};
`;

const LabeledSlider = ({
  id,
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
    <StyledSliderArea double={double} id={id}>
      <p>{title}</p>
      <section>
        <p>
          <Icon name="minus" color={color} opacity={1 - fraction} />
        </p>
        <StyledSlider
          min={min}
          max={max}
          value={value}
          step={(max - min) / 100}
          onChange={v => handleValueChange(id, v)}
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
        <p>
          <Icon name="plus" color={color} opacity={fraction} />
        </p>
      </section>
    </StyledSliderArea>
  );
};

LabeledSlider.propTypes = {
  id: PropTypes.string.isRequired,
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
