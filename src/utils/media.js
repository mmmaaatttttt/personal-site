import { css } from "styled-components";

const sizes = {
  large: 1240,
  medium: 1020,
  small: 890,
  extraSmall: 600
};

const media = Object.keys(sizes).reduce((accumulator, label) => {
  const emSize = sizes[label] / 16;
  accumulator[label] = (...args) => css`
    @media (max-width: ${emSize}em) {
      ${css(...args)};
    }
  `;
  return accumulator;
}, {});

export default media;
