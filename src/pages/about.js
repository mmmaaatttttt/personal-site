import React from "react";
import matt from "./images/matt.jpg";
import { emojify } from "react-emojione";
import styled from "styled-components";
import { rhythm } from "../utils/typography";
import COLORS from "../utils/styles";
import media from "../utils/media";

const RightP = styled.p`
  text-align: right;
`

const StyledHeadshotWrapper = styled.div`
  position: fixed;
  width: ${rhythm(25)};
  height: ${rhythm(25)};
  bottom: 0;
  right: 0;
  overflow: hidden;
  z-index: -1;

  ${media.medium`
    position: static;
    width: 100%;
    height: auto;
    text-align: center;
  `};
`

const StyledHeadshot = styled.img`
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  border: ${rhythm(0.25)} solid ${COLORS.LINK};
  top: ${rhythm(5)};
  right -${rhythm(5)};
  margin: 0 auto 1.44rem;
  display: block;

  ${media.medium`
    position: static;
    opacity: 1;
    width: 50%;
    border-width: ${rhythm(0.1)};
  `};
`

const About = ({data}) => (
  <div>
    <h1>About {data.site.siteMetadata.title}</h1>
    <StyledHeadshotWrapper>
      <StyledHeadshot src={matt} alt="Matt's face"/>
    </StyledHeadshotWrapper>
    <p>Hi, I'm Matt Lane. You may remember me from such organizations as <a href="https://www.mathalicious.com">Mathalicious</a>, <a href="https://www.rithmschool.com">Rithm School</a> (which I co-founded in 2016), or from my book, <a href="https://www.amazon.com/Power-Up-Unlocking-Hidden-Mathematics-Video/dp/0691161518">Power-Up: Unlocking the Hidden Mathematics in Video Games</a>.</p>
    <p>Or, you may not know me at all. In which case, it's nice to meet you. I look forward to creating many wonderful memories together!</p>
    <p>A little bit about me: I received my Ph.D. in mathematics from UCLA in 2012. I love my family, problem solving, teaching, learning, and ice cream.</p>
    <p>Even though it's a cesspool, the best way to reach me if you'd like to chat more is probably <a href="https://www.twitter.com/mmmaaatttttt">Twitter</a>. The only bigger cesspool I can think of is the comments section on any website, so for that reason, I don't enable comments on anything I write here.</p>
    <p>Take a look around, and let me know what you think!</p>
    <RightP><span>{emojify(':heart:')}</span> Matt</RightP>
  </div>
);

export default About; 

export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
