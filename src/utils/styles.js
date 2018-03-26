import { keyframes } from "styled-components";

const COLORS = {
  LINK: "#ff5700",
  NAV: "#f9f9f9",
  GRAY: "#bbb",
  DARK_GRAY: "#555",
  ORANGE: "#FF8F34",
  GREEN: "#52A081",
  MAROON: "#A05E52",
  BLUE: "#5ECFFF",
  RED: "#FF3C23",
  PURPLE: "#E15BFF"
};

const sizes = {
  maxWidthContent: "768px"
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export { sizes, fadeIn };

export default COLORS;
