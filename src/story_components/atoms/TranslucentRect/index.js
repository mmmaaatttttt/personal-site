import styled from "styled-components";

const TranslucentRect = styled.rect`
  opacity: 0.7;

  &:hover,
  &:active {
    opacity: 1;
  }
`;

export default TranslucentRect;
