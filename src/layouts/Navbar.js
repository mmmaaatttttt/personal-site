import React from "react";
import PropTypes from "prop-types";
import Link from "gatsby-link";
import styled from "styled-components";
import { rhythm } from "../utils/typography";

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${rhythm(0.5)};
  flex-direction: column;
  background-color: #f9f9f9;
  border-bottom: 1px solid #bbb;
  box-shadow: 0 1px 12px 3px #e2e2e2;
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
