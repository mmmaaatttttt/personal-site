import styled from "styled-components";

const NoScrollCircle = styled.circle`
  touch-action: none;
  transition: stroke-width 300ms;

  &:hover {
    fill: ${props => props.stroke};
    stroke-width: ${props => props.r * 1.5};
    cursor: pointer;
  }
`;

export default NoScrollCircle;