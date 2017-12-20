import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { rhythm } from "../../utils/typography";
import media from "../../utils/media";
import StyledNarrowContainer from "../atoms/StyledNarrowContainer";
import StyledIFrame from "../atoms/StyledIFrame";
import StyledAspectRatioWrapper from "../atoms/StyledAspectRatioWrapper";

const ResponsiveIFrame = ({
  heightOverWidth,
  src,
  frameBorder,
  allowFullScreen
}) => (
  <StyledNarrowContainer>
    <StyledAspectRatioWrapper heightOverWidth={heightOverWidth}>
      <StyledIFrame
        src={src}
        frameBorder={frameBorder}
        allowFullScreen={allowFullScreen}
      />
    </StyledAspectRatioWrapper>
  </StyledNarrowContainer>
);

ResponsiveIFrame.propTypes = {
  heightOverWidth: PropTypes.number,
  src: PropTypes.string.isRequired,
  frameBorder: PropTypes.string,
  allowFullScreen: PropTypes.bool
};

export default ResponsiveIFrame;
