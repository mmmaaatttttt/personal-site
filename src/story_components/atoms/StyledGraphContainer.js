import styled, { css } from "styled-components";
import media from "../../utils/media";

const StyledGraphContainer = styled.div`
  display: flex;

  ${props =>
    props.double &&
    css`
      flex-wrap: wrap;
    `} ${props =>
      !props.double &&
      css`
        ${media.small`
      flex-direction: column;
    `};
      `};
`;

export default StyledGraphContainer;
