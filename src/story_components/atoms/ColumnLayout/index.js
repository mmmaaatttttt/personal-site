import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import media, { sizes } from "utils/media";

const ColumnLayout = styled.div`
  display: flex;

  & > div {
    flex: 1;
  }

  ${props =>
    props.break &&
    css`
      ${media[props.break]`
      flex-direction: column;
    `};
    `};
`;

ColumnLayout.propTypes = {
  break: PropTypes.oneOf(Object.keys(sizes))
};

export default ColumnLayout;
