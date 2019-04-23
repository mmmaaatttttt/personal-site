import styled from "styled-components";
import PropTypes from "prop-types";
import media, { sizes } from "utils/media";

const NarrowContainer = styled.div`
  width: ${props => props.width};
  margin: ${props => props.margin};

  ${props => media[props.fullWidthAt]`
    width: 100%;
    margin: 0 auto
  `};
`;

NarrowContainer.propTypes = {
  fullWidthAt: PropTypes.oneOf(Object.keys(sizes)),
  margin: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired
};

NarrowContainer.defaultProps = {
  fullWidthAt: "extraSmall",
  margin: "0 auto",
  width: "80%"
};

export default NarrowContainer;
