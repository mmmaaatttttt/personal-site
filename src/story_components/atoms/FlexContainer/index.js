import styled, { css } from "styled-components";
import PropTypes from "prop-types";

const main = props => (props.column ? "align-items" : "justify-content");
const cross = props => (props.column ? "justify-content" : "align-items");

const FlexContainer = styled.div`
  display: flex;
  flex: 1;
  ${props =>
    props.column &&
    css`
      flex-direction: column;
    `} ${main}: ${props => props.main};
    ${cross}: ${props => props.cross};
`;

const flexAlignments = [
  "flex-start",
  "flex-end",
  "center",
  "baseline",
  "stretch",
  "space-between",
  "space-around"
];

FlexContainer.propTypes = {
  column: PropTypes.bool,
  main: PropTypes.oneOf(flexAlignments),
  cross: PropTypes.oneOf(flexAlignments)
};

FlexContainer.defaultProps = {
  main: "stretch",
  cross: "stretch"
};

export default FlexContainer;
