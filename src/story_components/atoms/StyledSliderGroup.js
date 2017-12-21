import styled from "styled-components";
import media from "../../utils/media";

const StyledSliderGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${media.small`
    flex: 0 1 auto;
  `};
`;

export default StyledSliderGroup;
