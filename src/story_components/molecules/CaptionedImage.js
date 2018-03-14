import React from "react";
import styled from "styled-components";
import NarrowContainer from "../atoms/NarrowContainer";
import StyledCaptionContainer from "../atoms/StyledCaptionContainer";
import images from "../../utils/images";

const NoMarginImg = styled.img`
  margin-bottom: 0;
`;

const CaptionedImage = ({ width, src, caption }) => (
  <NarrowContainer width={width}>
    <NoMarginImg src={images[src]} alt={caption} />
    <StyledCaptionContainer>{caption}</StyledCaptionContainer>
  </NarrowContainer>
);

export default CaptionedImage;
