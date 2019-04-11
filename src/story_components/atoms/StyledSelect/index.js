import Select from "react-select";
import styled from "styled-components";
import PropTypes from "prop-types";
import COLORS from "utils/styles";

const StyledSelect = styled(Select)`
  flex: 1;
  margin: ${props => props.margin}  
`;

StyledSelect.propTypes = {
  margin: PropTypes.string.isRequired
}

StyledSelect.defaultProps = {
  styles: {
    placeholder: () => ({
      color: COLORS.BLACK
    }),
    valueContainer: provided => ({
      ...provided,
      flexWrap: "nowrap"
    })
  },
  margin: "0.75rem 0 0 0"
};

export default StyledSelect;
