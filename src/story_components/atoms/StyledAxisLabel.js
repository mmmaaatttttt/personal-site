import styled from "styled-components";
import PropTypes from "prop-types";

const StyledAxisLabel = styled.text`
  text-anchor: ${props => props.anchor};
  font-style: italic;
  font-size: 125%;
  font-weight: bold;
  stroke: #fff;
`;

StyledAxisLabel.propTypes = {
  anchor: PropTypes.oneOf(["start", "middle", "end"]).isRequired
};

StyledAxisLabel.defaultProps = {
  anchor: "middle"
};

export default StyledAxisLabel;
