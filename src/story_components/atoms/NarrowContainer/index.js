import styled from "styled-components";
import PropTypes from "prop-types";
import media, { sizes } from "utils/media";

const NarrowContainer = styled.div`
  width: ${props => props.width};
  margin: 0 auto;

  ${props => media[props.fullWidthAt]`
    width: 100%;
  `};
`;

NarrowContainer.propTypes = {
  width: PropTypes.string.isRequired,
  fullWidthAt: PropTypes.oneOf(Object.keys(sizes))
};

NarrowContainer.defaultProps = {
  width: "80%",
  fullWidthAt: "extraSmall"
};

export default NarrowContainer;
