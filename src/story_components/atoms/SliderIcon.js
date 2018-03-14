import PropTypes from "prop-types";
import styled from "styled-components";

const DisabledIcon = styled.i`
  &:hover {
    cursor: not-allowed;
  }
`;

const SliderIcon = ({ name, color, opacity }) => (
  <DisabledIcon className={`fa fa-${name}`} style={{ color, opacity }} />
);

SliderIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired
};

SliderIcon.defaultProps = {
  color: "#000",
  opacity: 1
};

export default SliderIcon;
