import React from "react";
import styled from "styled-components";
import NarrowContainer from "../atoms/NarrowContainer";
import Caption from "../atoms/Caption";
import images from "../../utils/images";

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
