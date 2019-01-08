import styled from "styled-components";
import PropTypes from "prop-types";
import { rhythm } from "utils/typography";

const Caption = styled.p`
  text-align: center;
  font-weight: 700;
  font-size: 85%;
  margin-top: ${props => props.captionMarginTop};
`;

Caption.propTypes = {
  captionMarginTop: PropTypes.string.isRequired,
};

Caption.defaultProps = {
  captionMarginTop: rhythm(0.15)
};

export default Caption;
