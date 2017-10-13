import React from "react";
import PropTypes from "prop-types";
import LabeledSlider from "./LabeledSlider";
import styled from "styled-components";
import media from "../../utils/media";

const StyledSliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 50%;

  ${media.small`
    width: 100%;
  `};
`;

const SliderContainer = ({ data, handleValueChange }) => {
  let sliders = data.map(d => (
    <LabeledSlider
      key={d.id}
      id={d.id}
      min={d.min}
      max={d.max}
      value={d.value}
      handleValueChange={handleValueChange}
      title={d.title}
      color={d.color}
    />
  ));
  return <StyledSliderContainer>{sliders}</StyledSliderContainer>;
};

SliderContainer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  ),
  handleValueChange: PropTypes.func.isRequired
};

export default SliderContainer;
