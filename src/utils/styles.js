import { keyframes } from "styled-components";

const COLORS = {
  BLACK: "#000",
  BLUE: "#5ECFFF",
  DARK_BLUE: "#2227FF",
  DARK_GRAY: "#555",
  DARK_GREEN: "#00802b",
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

const fadeColors = (color1, color2) => keyframes`
  from {
    background-color: ${color1};
    box-shadow: 0;
  }
  to {
    background-color: ${color2};
    box-shadow: 0 0 5px 4px ${color1}
  }
`;

export { sizes, fadeIn, fadeColors };

export default COLORS;
