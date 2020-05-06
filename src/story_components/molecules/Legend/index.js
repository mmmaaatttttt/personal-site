import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FlexContainer, Icon } from "story_components";
import COLORS from "utils/styles";

const StyledHeader = styled.h4`
  margin-bottom: 0.1rem;
`;

const StyledLabelSpan = styled.span`
  margin-left: 0.25rem;
`;

const StyledLabelWrapper = styled.div`
  padding: 0 0.5rem;
`;
const defaultLabels = [
  {
    color: COLORS.BLUE,
    text: "Blue label"
  },
  {
    color: COLORS.RED,
    text: "Red label"
  }
];

function Legend({ title = "Default Title", labels = defaultLabels }) {
  return (
    <FlexContainer column cross="center" main="center">
      <StyledHeader>{title}</StyledHeader>
      <FlexContainer main="center" width="100%" shouldWrap>
        {labels.map(({ color, text }) => (
          <StyledLabelWrapper key={color}>
            <Icon color={color} name="square" />
            <StyledLabelSpan>{text}</StyledLabelSpan>
          </StyledLabelWrapper>
        ))}
      </FlexContainer>
    </FlexContainer>
  );
}

Legend.propTypes = {
  title: PropTypes.string,
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      text: PropTypes.string
    })
  )
};

export default React.memo(Legend);
