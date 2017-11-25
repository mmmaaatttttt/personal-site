import React, { Component } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { rhythm } from "../utils/typography";
import "katex/dist/katex.min.css";
import "font-awesome/css/font-awesome.min.css";
import { Helmet } from "react-helmet";
import logo from "../pages/images/logo.png";

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
`

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  componentDidMount() {
    this.setState({ show: true })
  }

  render() {
    const { children, data, location } = this.props;
    const display = this.state.show ? "flex" : "none";
    const { title, description, siteUrl } = data.site.siteMetadata
    return (
      <StyledPageWrapper style={{display}}>
        <Helmet>
          <title>{title}</title>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@mmmaaatttttt" />
          <meta name="twitter:title" content={title} />
          <meta name="og:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="og:description" content={description} />
          <meta name="og:url" content={`${siteUrl}${location.pathname}`} />
          <meta name="og:image" content={`${siteUrl}${logo}`} />
        </Helmet>
        <Navbar
          title={title}
          hide={/\/stories\/.+/.test(location.pathname)}
        />
        <StyledContentArea>{children()}</StyledContentArea>
        <Footer />
      </StyledPageWrapper>
    )
  }
}

export default App;

export const query = graphql`
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
