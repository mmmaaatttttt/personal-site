import React from "react";
import PropTypes from "prop-types";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const LabeledSlider = ({ id, min, max, value, handleValueChange }) => (
  <div className="LabeledSlider">
    <p>Negative</p>
    <Slider
      min={min}
      max={max}
      value={value}
      step={(max - min) / 100}
      onChange={v => handleValueChange(id, v)}
    />
    <p>Positive</p>
  </div>
);

LabeledSlider.propTypes = {
  id: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  handleValueChange: PropTypes.func.isRequired
};

export default LabeledSlider;
