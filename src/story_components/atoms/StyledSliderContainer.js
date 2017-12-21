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

      ${media.small`
        flex-direction: column;
      `};
    `};
`;

export default StyledSliderContainer;
