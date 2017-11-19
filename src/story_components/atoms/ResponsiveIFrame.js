import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { rhythm } from "../../utils/typography";
import media from "../../utils/media";

const SizeWrapper = styled.div`
  width: 80%;
  margin: 0 auto;

  ${media.extraSmall`
    width: 100%;
  `};
`

const StyledIFrameWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding: ${props => props.heightOverWidth * 100}% ${rhythm(1)} 0;
  margin: 0 auto ${rhythm(1)};
`

const StyledIFrame = styled.iframe`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`

const ResponsiveIFrame = ({heightOverWidth, src, frameBorder, allowFullScreen}) => (
  <SizeWrapper>
    <StyledIFrameWrapper heightOverWidth={heightOverWidth}>
      <StyledIFrame 
        src={src} 
        frameBorder={frameBorder}
        allowFullScreen={allowFullScreen}
      />
    </StyledIFrameWrapper>
  </SizeWrapper>
);

ResponsiveIFrame.propTypes = {
  heightOverWidth: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  frameBorder: PropTypes.string.isRequired,
  allowFullScreen: PropTypes.bool.isRequired,
};

ResponsiveIFrame.defaultProps = {
  heightOverWidth: 9 / 16,
  frameBorder: "0",
  allowFullScreen: true
};

export default ResponsiveIFrame;
