import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { fadeColors } from "utils/styles";
import media from "utils/media";
import { NarrowContainer } from "story_components";

const StyledFruitContainer = styled.div`
  border: 4px solid ${props => darken(0.2, props.color)};
  background-color: ${props =>
    props.darken ? darken(0.2, props.color) : props.color};
  margin: 2%;
  flex: 1;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-shadow: 2px 2px 6px black;
  min-height: 5rem;

  p {
    margin-bottom: 0;
    text-align: center;
  }

  h1 {
    font-size: 4rem;
    margin: 0;
    text-align: center;
  }

  &:hover {
    cursor: not-allowed;
  }

  ${media.small`
    h1 {
      font-size: 3rem;
    }
  `};

  ${props =>
    props.clickable &&
    css`
      animation: ${fadeColors(props.color, darken(0.2, props.color))} 1s
        infinite alternate;

      &:hover {
        cursor: pointer;
      }
    `};

  ${props =>
    props.faded &&
    css`
      opacity: 0.3;
    `};
`;

class FruitContainer extends PureComponent {
  handleClick = () => {
    const { clickable, updateCounts } = this.props;
    if (clickable) updateCounts();
  };

  render() {
    const { color, count, clickable, title, faded } = this.props;
    let text = "";
    if (count > 0) {
      text = (
        <div>
          <p>{title}</p>
          <h1>{count}</h1>
        </div>
      );
    }
    return (
      <StyledFruitContainer
        color={color}
        clickable={clickable}
        darken={count === 0}
        onClick={this.handleClick}
        faded={faded}
      >
        {text}
      </StyledFruitContainer>
    );
  }
}

FruitContainer.propTypes = {
  color: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  clickable: PropTypes.bool.isRequired,
  faded: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  updateCounts: PropTypes.func.isRequired
};

FruitContainer.defaultProps = {
  color: "#000",
  count: 0,
  clickable: false,
  faded: false,
  title: "",
  updateCounts: () => console.log("clicked")
};

export default FruitContainer;
