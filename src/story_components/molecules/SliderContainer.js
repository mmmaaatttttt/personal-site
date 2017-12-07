import React from "react";
import PropTypes from "prop-types";
import LabeledSlider from "./LabeledSlider";
import styled, { css } from "styled-components";
import media from "../../utils/media";

const StyledSliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 50%;

  ${media.small`
    width: 100%;
  `};

  ${props =>
    props.double &&
    css`
      width: 100%;
      flex-wrap: wrap;
      flex-direction: row;
    `};
`;

const SliderContainer = ({ data, handleValueChange, double }) => {
  const sliders = data.map((d, idx) => (
      <LabeledSlider
        key={idx}
        idx={idx}
        min={d.min}
        max={d.max}
        value={d.value}
        handleValueChange={handleValueChange}
        title={d.title}
        color={d.color}
        double={double}
      />
    ));
  return (
    <StyledSliderContainer double={double}>{sliders}</StyledSliderContainer>
  );
};

SliderContainer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  ),
  handleValueChange: PropTypes.func.isRequired,
  double: PropTypes.bool
};

export default SliderContainer;
