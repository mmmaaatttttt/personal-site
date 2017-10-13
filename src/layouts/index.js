import React from "react";
import g from "glamorous";
import { css } from "glamor";
import Link from "gatsby-link";
import styled from "styled-components";
import { rhythm } from "../utils/typography";

const Div = styled.div`
  margin: 0 auto;
  max-width: 800px;
  padding: ${rhythm(1.5)};
  padding-top: ${rhythm(1.5)};
`;

const H3 = styled.h3`
  margin-bottom: ${rhythm(2)};
  display: inline-block;
  font-style: normal;
`;

const StyledLink = styled(Link)`float: right;`;

export default ({ children, data }) => (
  <Div>
    <Link to="/">
      <H3>{data.site.siteMetadata.title}</H3>
    </Link>
    <StyledLink to="/about">About</StyledLink>
    {children()}
  </Div>
);

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
