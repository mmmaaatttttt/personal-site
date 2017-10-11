import React from "react";
import PropTypes from "prop-types";
import LabeledSlider from "./LabeledSlider";

const SliderContainer = ({ data, handleValueChange }) => {
  let sliders = data.map(d => (
    <LabeledSlider
      key={d.id}
      id={d.id}
      min={d.min}
      max={d.max}
      value={d.value}
      handleValueChange={handleValueChange}
    />
  ));
  return <div className="SliderContainer">{sliders}</div>;
};

SliderContainer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired
    })
  ),
  handleValueChange: PropTypes.func.isRequired
};

export default SliderContainer;
