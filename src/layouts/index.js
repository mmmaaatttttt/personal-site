import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { rhythm } from "../utils/typography";
import "katex/dist/katex.min.css";
import "font-awesome/css/font-awesome.min.css";

const StyledContentArea = styled.div`
  margin: 0 auto;
  padding: ${rhythm(1.5)};
  padding-top: ${rhythm(1.5)};
  flex: 1;
`;

const StyledPageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`

export default ({ children, data }) => (
  <StyledPageWrapper>
    <Navbar title={data.site.siteMetadata.title} />
    <StyledContentArea>{children()}</StyledContentArea>
    <Footer />
  </StyledPageWrapper>
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
