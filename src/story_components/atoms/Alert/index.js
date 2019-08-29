import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import COLORS from "utils/styles";

const Alert = styled.div`
  background-color: ${props => props.color};
  padding: 0.5rem;
  border-radius: 0.25rem;
  width: 100%;

  ${props => props.center && css`
    text-align: center;
  `}
`

Alert.propTypes = {
  center: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired
};

Alert.defaultProps = {
  center: false,
  color: COLORS.GREEN
};

export default Alert;