import React from "react";
import { render } from "@testing-library/react";
import FlexContainer from "./";

it("renders without crashing", () => {
  render(<FlexContainer />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
    <FlexContainer
      column
      wrap
      main="center"
      cross="center"
      margin="1rem"
      textAlign="right"
      width="90%"
    >
      <div>Here's a child</div>
      <div>Here's another</div>
      <div>Here's a third</div>
    </FlexContainer>
  );
  expect(asFragment()).toMatchSnapshot();
});
