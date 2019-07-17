import styled from "styled-components";
import { rhythm } from "utils/typography";
import media from "utils/media";
import COLORS from "utils/styles";

const StyledInput = styled.input`
  margin: ${rhythm(0.5)};
  padding: ${rhythm(0.2)};
  border: 1px solid ${COLORS.INPUT_GRAY};
  border-radius: 4px;

  ${media.medium`
    margin: ${rhythm(0.2)};
  `}

  &:focus {
    outline: none;
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
  }
`;

export default StyledInput;
