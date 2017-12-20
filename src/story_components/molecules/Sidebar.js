import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import "animate.css/animate.min.css";
import StyledSidebar from "../atoms/StyledSidebar";

const Sidebar = ({ children, direction }) => (
  <ScrollAnimation animateIn="fadeIn" animateOnce={true}>
    <StyledSidebar direction={direction}>{children}</StyledSidebar>
  </ScrollAnimation>
);

export default Sidebar;
