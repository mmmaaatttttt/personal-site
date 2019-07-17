import styled, { css } from "styled-components";
import PropTypes from "prop-types";

const main = props => (props.column ? "align-items" : "justify-content");
const cross = props => (props.column ? "justify-content" : "align-items");

const FlexContainer = styled.div`
  display: flex;
  flex: ${props => props.flex};
  flex-wrap: ${props => (props.shouldWrap ? "wrap" : "nowrap")};
    ${props =>
      props.column &&
      css`
        flex-direction: column;
      `}
    ${main}: ${props => props.main};
  ${cross}: ${props => props.cross};
  margin: ${props => props.margin};
  width: ${props => props.width};
  text-align: ${props => props.textAlign};
`;

const flexAlignments = [
  "flex-start",
  "flex-end",
  "center",
  "baseline",
  "stretch",
  "space-around",
  "space-between",
  "space-evenly"
];

FlexContainer.propTypes = {
  column: PropTypes.bool.isRequired,
  cross: PropTypes.oneOf(flexAlignments).isRequired,
  flex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  main: PropTypes.oneOf(flexAlignments).isRequired,
  margin: PropTypes.string.isRequired,
  textAlign: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  shouldWrap: PropTypes.bool.isRequired
};

FlexContainer.defaultProps = {
  column: false,
  cross: "stretch",
  flex: 1,
  main: "stretch",
  margin: "0",
  textAlign: "left",
  width: "auto",
  shouldWrap: false
};

export default FlexContainer;
