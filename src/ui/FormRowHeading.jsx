import styled from "styled-components";

const StyledFormRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function FormRowHeading({ children }) {
  return <StyledFormRow>{children}</StyledFormRow>;
}

export default FormRowHeading;
