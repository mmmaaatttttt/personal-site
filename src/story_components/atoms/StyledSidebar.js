import PropTypes from "prop-types";
import styled from "styled-components";
import { rhythm } from "../../utils/typography";
import { lighten } from "polished";
import COLORS, { sizes } from "../../utils/styles";
import media from "../../utils/media";

const StyledSidebar = styled.div`
  position: absolute;
  width: calc((100vw - ${sizes.maxWidthContent} - ${rhythm(2)}) / 2);
  background-color: ${lighten(0.48, COLORS.LINK)};
  ${props => props.direction}: ${rhythm(0.75)};
  font-style: italic;
  font-size: ${rhythm(0.4)};
  line-height: 2;
  padding: ${rhythm(0.5)};
  border-radius: 10px;
  box-shadow: 0 0 6px 2px ${COLORS.LINK};

  ${media.large`
    display: none;
  `};
`;

StyledSidebar.propTypes = {
  direction: PropTypes.oneOf(["left", "right"])
};

StyledSidebar.defaultProps = {
  direction: "left"
};

export default StyledSidebar;
