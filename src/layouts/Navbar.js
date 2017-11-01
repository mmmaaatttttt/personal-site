import React from "react";
import PropTypes from "prop-types";
import Link from "gatsby-link";
import styled from "styled-components";
import { rhythm } from "../utils/typography";

const H3 = styled.h3`
  // margin-bottom: ${rhythm(2)};
  // display: inline-block;
  // font-style: normal;
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: ${rhythm(0.5)};
`;

const Navbar = ({ children, title }) => (
  <StyledNav>
    <Link to="/">
      <H3>{title}</H3>
    </Link>
    <Link to="/about">About</Link>
    <Link to="/about">Stories</Link>
  </StyledNav>
);

Navbar.propTypes = {
  title: PropTypes.string.isRequired
};

export default Navbar;
