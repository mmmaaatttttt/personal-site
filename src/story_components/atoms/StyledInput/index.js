import styled from "styled-components";
import { rhythm } from "utils/typography";
import COLORS from "utils/styles";

const StyledInput = styled.input`
  margin: ${rhythm(0.5)};
  padding: ${rhythm(0.2)};
  border: ${rhythm(0.05)} solid ${COLORS.GRAY};
  border-radius: 10px;

  &:focus {
    outline: none;
    border-color: ${COLORS.BLUE};
  }
`;

export default StyledInput;
