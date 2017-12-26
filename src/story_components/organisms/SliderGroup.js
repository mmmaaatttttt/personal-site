import React from "react";
import PropTypes from "prop-types";
import LabeledSlider from "./LabeledSlider";
import StyledSliderGroup from "../atoms/StyledSliderGroup";

const SliderGroup = ({ data, handleValueChange, double }) => {
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
      flexZero={double}
    />
  ));
  return <StyledSliderGroup double={double}>{sliders}</StyledSliderGroup>;
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
