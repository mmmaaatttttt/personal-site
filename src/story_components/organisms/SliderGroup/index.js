import React from "react";
import PropTypes from "prop-types";
import { FlexContainer, LabeledSlider } from "story_components";

const SliderGroup = ({ data, handleValueChange }) => {
  const handleChangeWithIndex = idx => val => handleValueChange(idx, val);
  const sliders = data.map(d => (
    <LabeledSlider
      key={d.originalIdx}
      min={d.min}
      max={d.max}
      value={d.value}
      handleValueChange={handleChangeWithIndex(d.originalIdx)}
      title={d.title}
      color={d.color}
    />
  ));
  return (
    <FlexContainer column cross="center">
      {sliders}
    </FlexContainer>
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
  handleValueChange: PropTypes.func.isRequired
};

export default SliderGroup;
