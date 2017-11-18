import React from "react";
import styled, { keyframes } from "styled-components";
import Link from "gatsby-link";
import { emojify } from 'react-emojione';

const wave = keyframes`
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-20deg);
  }

  50% {
    transform: rotate(0deg);
  }

  75% {
    transform: rotate(20deg);
  }

  100% {
    transform: rotate(0deg);
  }
`;

const StyledEmoji = styled.div`
  & span {
    animation: ${wave} 2s linear 2;
    font-size: 40rem;
  }
`;

const Home = () => (
  <div>
    <h1>Hi. I'm Matt.</h1>
    <StyledEmoji>
      {emojify(':raised_hand_with_fingers_splayed:')} 
    </StyledEmoji>
    <p>Use the nav bar to explore the site. You'll figure it out. I'm sure of it.</p>
  </div>
);

export default Home;
