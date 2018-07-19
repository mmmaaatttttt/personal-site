import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FlexContainer, LabeledSlider } from "story_components";

const LabeledSliderWrapper = styled.div`
  margin: 0.25rem;
`;

const SliderGroup = ({ data, column }) => {
  const sliders = data.map((d, i) => (
    <LabeledSliderWrapper key={d.hasOwnProperty("key") ? d.key : i}>
      <LabeledSlider
        min={d.min}
        max={d.max}
        step={d.step}
        value={d.value}
        handleValueChange={d.handleValueChange}
        title={d.title}
        color={d.color}
        tickCount={d.tickCount}
        minIcon={d.minIcon}
        maxIcon={d.maxIcon}
        fadeIcons={d.fadeIcons}
      />
    </LabeledSliderWrapper>
  ));
  return (
    <FlexContainer column={column} cross="center" flex={data.length}>
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
      key: PropTypes.any,
      handleValueChange: PropTypes.func.isRequired,
      tickCount: PropTypes.number,
      minIcon: PropTypes.string,
      maxIcon: PropTypes.string,
      fadeIcons: PropTypes.bool
    })
  ),
  column: PropTypes.bool.isRequired
};

SliderGroup.defaultProps = {
  column: true
};

export default SliderGroup;
