import styled from "styled-components";
import PropTypes from "prop-types";
import media from "utils/media";

const NarrowContainer = styled.div`
  width: ${props => props.width};
  margin: 0 auto;

  ${media.extraSmall`
    width: 100%;
  `};
`;

NarrowContainer.propTypes = {
  width: PropTypes.string.isRequired
};

NarrowContainer.defaultProps = {
  width: "80%"
};

export default NarrowContainer;
