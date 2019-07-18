import Select from "react-select";
import styled from "styled-components";
import PropTypes from "prop-types";
import COLORS from "utils/styles";

const StyledSelect = styled(Select)`
  flex: ${props => props.flex};
  margin: ${props => props.margin};
`;

StyledSelect.propTypes = {
  flex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  margin: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired
}

StyledSelect.defaultProps = {
  flex: 1,
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
