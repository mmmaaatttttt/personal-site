import React, { Component } from "react";
import styled, { css } from "styled-components";

const StyledAxis = styled.g`
  & .tick line {
    stroke: #ccc;
    stroke-dasharray: 10, 5;
  }
  ${props =>
    props.direction === "x" &&
    css`
      & .tick:nth-child(2) {
        display: none;
      }
    `};
`;

export default StyledAxis;
