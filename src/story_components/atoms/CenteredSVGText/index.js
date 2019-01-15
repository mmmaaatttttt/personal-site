import styled from "styled-components";
import PropTypes from "prop-types";

const CenteredSVGText = styled.text`
  text-anchor: middle;
  alignment-baseline: ${props => props.baseline};
  font-size: ${props => props.fontSize};
`;

CenteredSVGText.propTypes = {
  fontSize: PropTypes.string.isRequired,
  baseline: PropTypes.oneOf(["middle", "central"]).isRequired,
};

CenteredSVGText.defaultProps = {
  fontSize: "100%",
  baseline: "middle"
};

export default CenteredSVGText;
