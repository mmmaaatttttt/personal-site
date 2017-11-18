import React from "react";
import PropTypes from "prop-types";
import Link from "gatsby-link";
import styled from "styled-components";
import { rhythm } from "../utils/typography";
import { navStyles } from "./mixins";
import COLORS from "../utils/styles";

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${rhythm(0.5)};
  flex-direction: column;
  border-bottom: 1px solid ${COLORS.NAV_BORDER};
  ${navStyles}
`;

const StyledHeader = styled.h3`
  margin-bottom: ${rhythm(0.25)};
`;

const StyledLinkContainer = styled.div`
  display: flex;
  width: 25%;
  justify-content: center;

  & > * {
    margin: 0 ${rhythm(0.25)};
  }
`;

const Navbar = ({ children, title }) => (
  <StyledNav>
    <Link to="/">
      <StyledHeader>{title}</StyledHeader>
    </Link>
    <StyledLinkContainer>
      <Link to="/about">About</Link>
      <span>|</span>
      <Link to="/stories">Stories</Link>
    </StyledLinkContainer>
  </StyledNav>
);

Navbar.propTypes = {
  title: PropTypes.string.isRequired
};

export default Navbar;
