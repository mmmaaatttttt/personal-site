import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { rhythm } from "utils/typography";
import COLORS, { hexToRgba } from "utils/styles";

const StyledOverlayContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${props => hexToRgba(props.backgroundColor, 0.7)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledMessageContainer = styled.div`
  background-color: ${COLORS.WHITE};
  padding: ${rhythm(1)};
  border-radius: ${rhythm(0.25)};
  text-align: center;

  p {
    margin-bottom: 0;
  }
`;

const ScreenOverlay = ({ backgroundColor, children }) => (
  <StyledOverlayContainer backgroundColor={backgroundColor}>
    <StyledMessageContainer>{children}</StyledMessageContainer>
  </StyledOverlayContainer>
);

ScreenOverlay.propTypes = {
  backgroundColor: PropTypes.string.isRequired
};

ScreenOverlay.defaultProps = {
  backgroundColor: COLORS.GRAY
};

export default ScreenOverlay;
