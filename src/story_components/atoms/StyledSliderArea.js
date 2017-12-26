import styled, { css } from "styled-components";

const StyledSliderArea = styled.div`
  text-align: center;
  flex: 1;

  ${props =>
    props.flexZero &&
    css`
      flex: 0;
    `} section {
    display: flex;
    align-items: center;
  }
`;

export default StyledSliderArea;
