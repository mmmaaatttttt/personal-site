import styled, { css } from "styled-components";
import media from "../../utils/media";

const StyledColumnLayout = styled.div`
  display: flex;

  & > div {
    flex: 1;
  }

  ${props =>
    props.break &&
    css`
      ${media[props.break]`
      flex-direction: column;
    `};
    `};
`;

export default StyledColumnLayout;
