import styled from "styled-components";

const StyledP = styled.p`
  margin: ${props => props.margin};
`;

StyledP.defaultProps = {
  margin: "0 0 1.44rem 0"
};

export default StyledP;
