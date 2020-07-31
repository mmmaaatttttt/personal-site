import React, { useEffect, useState } from "react";
import { StaticQuery, graphql } from "gatsby";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { rhythm } from "utils/typography";
import "katex/dist/katex.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import matt from "../images/matt.jpg";

const StyledContentArea = styled.div`
  width: 100%;
  justify-content: center;
  padding-top: ${rhythm(1.5)};
  flex: 1;
  display: flex;
`;

const StyledPageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;

function MainLayout({ children, location, outline }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const display = show ? "flex" : "none";
  return (
    <StaticQuery
      query={query}
      render={data => {
        const { title, description, siteUrl } = data.site.siteMetadata;
        return (
          <StyledPageWrapper style={{ display }}>
            <Helmet>
              <title>{title}</title>
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:site" content="@mmmaaatttttt" />
              <meta name="twitter:title" content={title} />
              <meta name="twitter:description" content={description} />
              <meta name="twitter:image" content={`${siteUrl}${matt}`} />
              <meta name="og:title" content={title} />
              <meta name="og:description" content={description} />
              <meta name="og:url" content={`${siteUrl}${location.pathname}`} />
              <meta name="og:image" content={`${siteUrl}${matt}`} />
            </Helmet>
            <Navbar
              title={title}
              hide={/\/stories\/.+/.test(location.pathname)}
              outline={outline}
            />
            <StyledContentArea>{children}</StyledContentArea>
            <Footer showMailingListForm={location.pathname !== "/"} />
          </StyledPageWrapper>
        );
      }}
    />
  );
}

export default MainLayout;

const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
  }
`;
