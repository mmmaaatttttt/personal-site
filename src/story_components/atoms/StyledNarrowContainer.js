import styled from "styled-components";
import PropTypes from "prop-types";
import media from "../../utils/media";

const StyledNarrowContainer = styled.div`
  width: ${props => props.width};
  margin: 0 auto;

  ${media.extraSmall`
    width: 100%;
  `};
`;

StyledNarrowContainer.propTypes = {
  width: PropTypes.string.isRequired
};

StyledNarrowContainer.defaultProps = {
  width: "80%"
};

export default StyledNarrowContainer;
