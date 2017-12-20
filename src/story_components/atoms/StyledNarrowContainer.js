import styled from "styled-components";
import media from "../../utils/media";

const StyledNarrowContainer = styled.div`
  width: 80%;
  margin: 0 auto;

  ${media.extraSmall`
    width: 100%;
  `};
`;

export default StyledNarrowContainer;
