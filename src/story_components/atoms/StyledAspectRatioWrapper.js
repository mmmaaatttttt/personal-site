import PropTypes from "prop-types";
import styled from "styled-components";
import { rhythm } from "../../utils/typography";

const StyledAspectRatioWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding: ${props => props.heightOverWidth * 100}% ${rhythm(1)} 0;
  margin: 0 auto ${rhythm(1)};
`;

StyledAspectRatioWrapper.propTypes = {
  heightOverWidth: PropTypes.number.isRequired
};

StyledAspectRatioWrapper.defaultProps = {
  heightOverWidth: 9 / 16
};

export default StyledAspectRatioWrapper;
