import styled from "styled-components";
import PropTypes from "prop-types";

const StyledTable = styled.table`
  margin: ${props => props.margin};

  th,
  td {
    text-align: center;
    padding: 0.5rem 0;
  }
`;

StyledTable.propTypes = {
  margin: PropTypes.string.isRequired
};

StyledTable.defaultProps = {
  margin: "0 0 1.44rem 0"
}

export default StyledTable;
