import PropTypes from "prop-types";
import styled from "styled-components";
import { rhythm } from "utils/typography";

const AspectRatioWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding: ${props => props.heightOverWidth * 100}% ${rhythm(1)} 0;
  margin: 0 auto ${rhythm(1)};
`;

AspectRatioWrapper.propTypes = {
  heightOverWidth: PropTypes.number.isRequired
};

AspectRatioWrapper.defaultProps = {
  heightOverWidth: 9 / 16
};

export default AspectRatioWrapper;
