import React from "react";
import Link from "gatsby-link";
import styled from "styled-components";
import { rhythm } from "utils/typography";
import { navStyles } from "./mixins";
import media from "utils/media";
import COLORS from "utils/styles";

const StyledFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${rhythm(0.5)};
  border-top: 1px solid ${COLORS.GRAY};
  position: relative;
  z-index: 1;
  ${navStyles} small {
    font-size: 60%;
  }
`;

const StyledLink = styled(Link)`
  flex-grow: 1;
  flex-basis: 0;
`;

const StyledIconArea = styled.div`
  min-width: ${rhythm(4)};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 1;
  flex-basis: 0;

  a {
    display: flex;
    margin-left: ${rhythm(0.35)};
  }

  ${media.small`
    font-size: 80%;
  `};
`;

const StyledCCImageWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;

  img {
    width: 100%;
    height: auto;
  }
`;

const StyledCCArea = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 2;
  flex-basis: 0;

  img {
    margin: 0;
  }

  a {
    display: flex;
    margin-right: ${rhythm(0.5)};
  }

  ${media.medium`
    a {
      margin-right: 0;
    }

    small {
      display: none;
    }
  `};
`;

const Footer = () => (
  <StyledFooter>
    <StyledLink to="/terms">
      <small>Terms & Privacy</small>
    </StyledLink>
    <StyledCCArea>
      <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">
        <StyledCCImageWrapper>
          <img
            alt="Creative Commons License"
            style={{ borderWidth: 0 }}
            src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png"
          />
        </StyledCCImageWrapper>
      </a>
      <small>Content licensed under CC-BY-NC (unless stated otherwise).</small>
    </StyledCCArea>
    <StyledIconArea>
      <a href="https://twitter.com/mmmaaatttttt">
        <i className="fab fa-twitter fa-2x" />
      </a>
      <a href="https://github.com/mmmaaatttttt/personal-site">
        <i className="fab fa-github fa-2x" />
      </a>
      <a href="https://www.amazon.com/Power-Up-Unlocking-Hidden-Mathematics-Video/dp/0691161518">
        <i className="fas fa-book fa-2x" />
      </a>
      <a href="/rss.xml">
        <i className="fas fa-rss fa-2x" />
      </a>
    </StyledIconArea>
  </StyledFooter>
);

export default Footer;
