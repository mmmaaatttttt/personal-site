import React from "react";
import styled from "styled-components";
import { NarrowContainer, Caption } from "story_components";
import images from "utils/images";

const MarginImg = styled.img`
  display: block;
  margin: 0 auto;
`;

const CaptionedImage = ({ width, src, caption }) => (
  <NarrowContainer width={width}>
    <MarginImg src={images[src]} alt={caption} />
    <Caption>{caption}</Caption>
  </NarrowContainer>
);

export default CaptionedImage;
