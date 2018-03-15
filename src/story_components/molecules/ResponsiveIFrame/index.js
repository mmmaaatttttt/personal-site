import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { rhythm } from "utils/typography";
import media from "utils/media";
import { NarrowContainer, AspectRatioWrapper } from "story_components";

const StyledIFrame = styled.iframe`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

const ResponsiveIFrame = ({
  heightOverWidth,
  src,
  frameBorder,
  allowFullScreen
}) => (
  <NarrowContainer>
    <AspectRatioWrapper heightOverWidth={heightOverWidth}>
      <StyledIFrame
        src={src}
        frameBorder={frameBorder}
        allowFullScreen={allowFullScreen}
      />
    </AspectRatioWrapper>
  </NarrowContainer>
);

ResponsiveIFrame.propTypes = {
  heightOverWidth: PropTypes.number,
  src: PropTypes.string.isRequired,
  frameBorder: PropTypes.string.isRequired,
  allowFullScreen: PropTypes.bool.isRequired
};

ResponsiveIFrame.defaultProps = {
  frameBorder: "0",
  allowFullScreen: true
};

export default ResponsiveIFrame;
