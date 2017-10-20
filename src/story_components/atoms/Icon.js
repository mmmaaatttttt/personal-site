import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledIcon = styled.i`
  &:hover {
    cursor: not-allowed;
  }
`;

const Icon = ({ name, color, opacity }) => (
  <StyledIcon className={`fa fa-${name}`} style={{ color, opacity }} />
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired
};

Icon.defaultProps = {
  color: "#000",
  opacity: 1
};

export default Icon;
