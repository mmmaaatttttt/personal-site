import styled, { css } from "styled-components";
import PropTypes from "prop-types";

const main = props => (props.column ? "align-items" : "justify-content");
const cross = props => (props.column ? "justify-content" : "align-items");

const StyledFlexContainer = styled.div`
  display: flex;
  flex: 1;
  ${props =>
    props.column &&
    css`
      flex-direction: column;
    `} ${main}: ${props => props.main};
`;

StyledFlexContainer.propTypes = {
  column: PropTypes.bool,
  main: PropTypes.oneOf([
    "flex-start",
    "flex-end",
    "center",
    "baseline",
    "stretch"
  ])
};

StyledFlexContainer.defaultProps = {
  main: "stretch"
};

export default StyledFlexContainer;
