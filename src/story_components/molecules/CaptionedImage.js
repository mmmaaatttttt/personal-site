import React from "react";
import styled from "styled-components";
import StyledNarrowContainer from "../atoms/StyledNarrowContainer";
import StyledCaptionContainer from "../atoms/StyledCaptionContainer";
import images from "../../utils/images";

const NoMarginImg = styled.img`
  margin-bottom: 0;
`;

const CaptionedImage = ({ width, src, caption }) => (
  <StyledNarrowContainer width={width}>
    <NoMarginImg src={images[src]} alt={caption} />
    <StyledCaptionContainer>{caption}</StyledCaptionContainer>
  </StyledNarrowContainer>
);

export default CaptionedImage;
