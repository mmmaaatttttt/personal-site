import React from "react";
import styled from "styled-components";
import { rhythm } from "../utils/typography";
import media from "../utils/media";
import Caption from "../story_components/atoms/Caption";

const StyledVisualizationContainer = styled.div`
  width: 150%;
  margin-left: -25%;
  display: flex;
  flex-direction: column;

  ${media.large`
    width: 140%;
    margin-left: -20%;
  `}

  ${media.medium`
    width: 120%;
    margin-left: -10%;
  `}

  ${media.small`
    width: 100%;
    margin-left: 0;
  `}
`;

function withCaption(ComposedComponent) {
  return props => {
    const { caption, ...otherProps } = props;
    return (
      <StyledVisualizationContainer>
        <ComposedComponent {...otherProps} />
        <Caption>{caption}</Caption>
      </StyledVisualizationContainer>
    );
  };
}

export default withCaption;
