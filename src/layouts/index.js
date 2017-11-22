import React, { Component } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { rhythm } from "../utils/typography";
import "katex/dist/katex.min.css";
import "font-awesome/css/font-awesome.min.css";

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
    return (
      <StyledPageWrapper style={{display}}>
        <Navbar
          title={data.site.siteMetadata.title}
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
      }
    }
  }
`;
