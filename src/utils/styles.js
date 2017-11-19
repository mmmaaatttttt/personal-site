import { keyframes } from "styled-components";

const COLORS = {
  LINK: "#ff5700",
  NAV: "#f9f9f9",
  NAV_BORDER: "#bbb"
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
