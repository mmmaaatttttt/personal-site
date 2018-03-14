import PropTypes from "prop-types";
import styled from "styled-components";

const StyledIFrame = styled.iframe`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

StyledIFrame.propTypes = {
  src: PropTypes.string.isRequired,
  frameBorder: PropTypes.string.isRequired,
  allowFullScreen: PropTypes.bool.isRequired
};

StyledIFrame.defaultProps = {
  frameBorder: "0",
  allowFullScreen: true
};

export default StyledIFrame;
