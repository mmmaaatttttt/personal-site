import React from "react";
import styled from "styled-components";
import { fadeIn } from "../utils/styles";
import { rhythm } from "../utils/typography";

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  animation: ${fadeIn} 2s 0.5s forwards;
  opacity: 0;
  padding: ${rhythm(1)};
`;

const StyledH1 = styled.h1`
  font-size: 500%;
`;

const StyledH2 = styled.h2`
  animation: ${fadeIn} 1s 1.5s forwards;
  opacity: 0;
`;

const StyledP = styled.p`
  animation: ${fadeIn} 1s 2.5s forwards;
  opacity: 0;
`

const Home = () => (
  <StyledHome>
    <StyledH1>Hi!</StyledH1>
    <StyledH2>I'm Matt. 👋</StyledH2>
    <StyledP>Use the nav bar to explore the site. You'll figure it out.</StyledP>
  </StyledHome>
);

export default Home;
