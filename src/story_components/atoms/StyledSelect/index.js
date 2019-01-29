import Select from "react-select";
import styled from "styled-components";
import COLORS from "utils/styles";

const StyledSelect = styled(Select)`
  flex: 1;
`;

StyledSelect.defaultProps = {
  styles: {
    placeholder: () => ({
      color: COLORS.BLACK
    })
  }
}

export default StyledSelect;
