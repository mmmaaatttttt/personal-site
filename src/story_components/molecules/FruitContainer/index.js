import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { darken } from "polished";
import { NarrowContainer } from "story_components";

const StyledFruitContainer = styled.div`
  border: 4px solid ${props => darken(0.2, props.color)};
  background-color: ${props => props.color};
  flex: 0 45%;
  margin: 2.5%;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 5rem;
  text-shadow: 2px 2px 6px black;

  &:last-child {
    flex: 0 95%;
  }
`;

class FruitContainer extends Component {
  render() {
    const { color, count } = this.props;
    return <StyledFruitContainer color={color}>{count}</StyledFruitContainer>;
  }
}

FruitContainer.propTypes = {
  color: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired
};

export default FruitContainer;
