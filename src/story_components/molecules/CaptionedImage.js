import React from "react";
import StyledNarrowContainer from "../atoms/StyledNarrowContainer";
import StyledCaptionContainer from "../atoms/StyledCaptionContainer";
import images from "../../utils/images";

const CaptionedImage = ({ width, src, caption }) => (
  <StyledNarrowContainer width={width}>
    <img src={images[src]} alt={caption} />
    <StyledCaptionContainer>{caption}</StyledCaptionContainer>
  </StyledNarrowContainer>
);

export default CaptionedImage;
