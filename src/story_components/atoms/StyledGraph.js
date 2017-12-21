import styled, { css } from "styled-components";
import media from "../../utils/media";

const StyledGraph = styled.div`
  width: 50%;

  ${props =>
    !props.double &&
    css`
      ${media.small`
        width: 100%;
      `};
    `};
`;

export default StyledGraph;
