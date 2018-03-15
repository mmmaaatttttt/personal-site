import styled from "styled-components";
import PropTypes from "prop-types";

const AxisLabel = styled.text`
  text-anchor: ${props => props.anchor};
  font-style: italic;
  font-size: 125%;
  font-weight: bold;
  stroke: #fff;
`;

AxisLabel.propTypes = {
  anchor: PropTypes.oneOf(["start", "middle", "end"]).isRequired
};

AxisLabel.defaultProps = {
  anchor: "middle"
};

export default AxisLabel;
