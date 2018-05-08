import { keyframes } from "styled-components";

const COLORS = {
  BLACK: "#000",
  BLUE: "#5ECFFF",
  DARK_BLUE: "#2227FF",
  DARK_GRAY: "#555",
  DARK_GREEN: "#114F26",
  GRAY: "#BBB",
  GREEN: "#52A081",
  LINK: "#ff5700",
  MAROON: "#A05E52",
  NAV: "#f9f9f9",
  ORANGE: "#FF8F34",
  PURPLE: "#E15BFF",
  RED: "#FF3C23",
  WHITE: "#FFF",
  YELLOW: "#FFEC28"
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
