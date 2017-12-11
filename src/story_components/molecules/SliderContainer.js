import React from "react";
import PropTypes from "prop-types";
import SliderGroup from "./SliderGroup";
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

const SliderContainer = ({ data, handleValueChange, double, colors }) => {
  const dataWithIndex = data.map((d, i) => ({...d, originalIdx: i}));
  const sliderGroups = colors.map(color => (
    <SliderGroup
      key={color}
      data={dataWithIndex.filter(d => d.color === color)}
      handleValueChange={handleValueChange}
      double={double}
    />
  ));
  return (
    <StyledSliderContainer double={double}>{sliderGroups}</StyledSliderContainer>
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
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  double: PropTypes.bool
};

export default SliderContainer;
