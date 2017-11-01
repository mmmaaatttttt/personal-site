import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import { rhythm } from "../utils/typography";
import "katex/dist/katex.min.css";
import "font-awesome/css/font-awesome.min.css";
import { sizes } from "../utils/styles";

const StyledContentArea = styled.div`
  margin: 0 auto;
  max-width: ${sizes.maxWidthContent};
  padding: ${rhythm(1.5)};
  padding-top: ${rhythm(1.5)};
`;

export default ({ children, data }) => (
  <div>
    <Navbar title={data.site.siteMetadata.title} />
    <StyledContentArea>{children()}</StyledContentArea>
  </div>
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
