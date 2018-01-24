import styled, { css } from "styled-components";
import PropTypes from "prop-types";

const CenteredSVGText = styled.text`
  text-anchor: middle;
  alignment-baseline: middle;
  font-size: ${props => props.fontSize};
`;

CenteredSVGText.propTypes = {
  fontSize: PropTypes.string.isRequired
};

CenteredSVGText.defaultProps = {
  fontSize: "100%"
};

export default CenteredSVGText;
