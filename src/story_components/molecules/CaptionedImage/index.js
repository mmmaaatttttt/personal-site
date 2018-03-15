import React from "react";
import styled from "styled-components";
import { NarrowContainer, Caption } from "story_components";
import images from "utils/images";

const NoMarginImg = styled.img`
  margin-bottom: 0;
`;

const CaptionedImage = ({ width, src, caption }) => (
  <NarrowContainer width={width}>
    <NoMarginImg src={images[src]} alt={caption} />
    <Caption>{caption}</Caption>
  </NarrowContainer>
);

export default CaptionedImage;
