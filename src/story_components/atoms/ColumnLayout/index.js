import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import media, { sizes } from "utils/media";

const ColumnLayout = styled.div`
  display: flex;

  ${props =>
    props.sizes
      ? props.sizes.map(
          (size, idx) => css`
            & > div:nth-child(${idx + 1}) {
              flex: ${size};
            }
          `
        )
      : css`
          & > div {
            flex: 1;
          }
        `} ${props =>
    props.break &&
    css`
      ${media[props.break]`
      flex-direction: column;
    `};
    `};
`;

ColumnLayout.propTypes = {
  break: PropTypes.oneOf(Object.keys(sizes)),
  sizes: PropTypes.arrayOf(PropTypes.number)
};

export default ColumnLayout;
