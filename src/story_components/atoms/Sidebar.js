import React from "react";
import PropTypes from "prop-types";
import ScrollAnimation from "react-animate-on-scroll";
import "animate.css/animate.min.css";
import styled from "styled-components";
import { rhythm } from "../../utils/typography";
import { lighten } from "polished";
import COLORS, { sizes } from "../../utils/styles";
import media from "../../utils/media";

const StyledSidebarWrapper = styled.div`
  width: 100vw;
  height: 0;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;

  ${media.large`
    display: none;
  `};
`;

const StyledSidebarContent = styled.div`
  position: absolute;
  width: calc((100vw - ${sizes.maxWidthContent} - ${rhythm(1.5)}) / 2);
  background-color: ${lighten(0.48, COLORS.LINK)};
  ${props => props.direction}: ${rhythm(1)};
  font-style: italic;
  font-size: ${rhythm(0.4)};
  line-height: 2;
  padding: ${rhythm(0.75)};
  border-radius: 10px;
  box-shadow: 0 0 6px 2px ${COLORS.LINK};
`;

const Sidebar = ({ children, direction }) => (
  <ScrollAnimation animateIn="fadeIn" animateOnce={true}>
    <StyledSidebarWrapper>
      <StyledSidebarContent direction={direction}>
        {children}
      </StyledSidebarContent>
    </StyledSidebarWrapper>
  </ScrollAnimation>
);

Sidebar.propTypes = {
  direction: PropTypes.oneOf(["left", "right"])
};

Sidebar.defaultProps = {
  direction: "left"
};

export default Sidebar;
