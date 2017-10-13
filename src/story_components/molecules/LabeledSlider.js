import React from "react";
import PropTypes from "prop-types";
import StyledSlider from "../atoms/StyledSlider";
import styled from "styled-components";
import { rhythm } from "../../utils/typography";

const StyledSliderArea = styled.div`
  text-align: center;

  p {
    margin: 0 ${rhythm(0.5)};
  }

  section {
    display: flex;
    align-items: center;
  }
`;

// const StyledSlider =

const LabeledSlider = ({ id, min, max, value, handleValueChange, title }) => (
  <StyledSliderArea>
    <p>{title}</p>
    <section>
      <p>Negative</p>
      <StyledSlider
        min={min}
        max={max}
        value={value}
        step={(max - min) / 100}
        onChange={v => handleValueChange(id, v)}
      />
      <p>Positive</p>
    </section>
  </StyledSliderArea>
);

LabeledSlider.propTypes = {
  id: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default LabeledSlider;
