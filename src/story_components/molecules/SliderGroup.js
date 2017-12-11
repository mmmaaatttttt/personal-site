import React from "react";
import PropTypes from "prop-types";
import LabeledSlider from "./LabeledSlider";
import styled, { css } from "styled-components";
import media from "../../utils/media";

const StyledSliderGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SliderGroup = ({ data, handleValueChange, double }) => {
  const sliders = data.map(d => (
      <LabeledSlider
        key={d.originalIdx}
        idx={d.originalIdx}
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
    <StyledSliderGroup double={double}>{sliders}</StyledSliderGroup>
  );
};

SliderGroup.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      originalIdx: PropTypes.number.isRequired
    })
  ),
  handleValueChange: PropTypes.func.isRequired,
  double: PropTypes.bool
};

export default SliderGroup;
