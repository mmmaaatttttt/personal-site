import React from "react";
import PropTypes from "prop-types";
import ScrollAnimation from "react-animate-on-scroll";
import "animate.css/animate.min.css";
import styled from "styled-components";
import { rhythm } from "../../utils/typography";
import { lighten } from "polished";
import COLORS, { sizes } from "../../utils/styles";
import media from "../../utils/media";

const StyledSidebarContent = styled.div`
  position: absolute;
  width: calc((100vw - ${sizes.maxWidthContent} - ${rhythm(2)}) / 2);
  background-color: ${lighten(0.48, COLORS.LINK)};
  ${props => props.direction}: ${rhythm(0.75)};
  font-style: italic;
  font-size: ${rhythm(0.4)};
  line-height: 2;
  padding: ${rhythm(0.5)};
  border-radius: 10px;
  box-shadow: 0 0 6px 2px ${COLORS.LINK};

  ${media.large`
    display: none;
  `};
`;

const Sidebar = ({ children, direction }) => (
  <ScrollAnimation animateIn="fadeIn" animateOnce={true}>
    <StyledSidebarContent direction={direction}>
      {children}
    </StyledSidebarContent>
  </ScrollAnimation>
);

Sidebar.propTypes = {
  direction: PropTypes.oneOf(["left", "right"])
};

Sidebar.defaultProps = {
  direction: "left"
};

export default Sidebar;
