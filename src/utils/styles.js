import { keyframes } from "styled-components";

const COLORS = {
  BLACK: "#000000",
  BLUE: "#5ECFFF",
  DARK_BLUE: "#2227FF",
  DARK_GRAY: "#555555",
  DARK_GREEN: "#00802b",
  GRAY: "#BBBBBB",
  GREEN: "#52A081",
  LINK: "#ff5700",
  MAROON: "#A05E52",
  NAV: "#f9f9f9",
  ORANGE: "#FF8F34",
  PURPLE: "#E15BFF",
  RED: "#FF3C23",
  WHITE: "#FFFFFF",
  YELLOW: "#FFEC28"
};

const hexToRgba = (hex, opacity) => {
  const numbers = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(
    subHex => parseInt(subHex, 16)
  );
  return `rgba(${numbers},${opacity})`;
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

export { fadeColors, fadeIn, hexToRgba, sizes };

export default COLORS;
