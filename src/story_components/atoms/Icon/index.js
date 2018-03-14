import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const Styled = styled.i`
  ${props =>
    props.disabled &&
    css`
      &:hover {
        cursor: not-allowed;
      }
    `};
`;

const Icon = ({ name, color, opacity, disabled, size }) => (
  <Styled className={`fa fa-${name} fa-${size}x`} style={{ color, opacity }} />
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired,
  size: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired,
  disabled: PropTypes.bool.isRequired
};

Icon.defaultProps = {
  color: "#000",
  opacity: 1,
  size: 1,
  disabled: false
};

export default Icon;
