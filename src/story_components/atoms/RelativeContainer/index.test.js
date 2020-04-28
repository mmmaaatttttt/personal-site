import React from "react";
import { render } from "@testing-library/react";
import RelativeContainer from "./";

it("renders without crashing", () => {
  render(<RelativeContainer />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
    <RelativeContainer>
      <div>hello</div>
    </RelativeContainer>
  );
  expect(asFragment()).toMatchSnapshot();
});
