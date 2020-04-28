import React from "react";
import { render } from "@testing-library/react";
import NarrowContainer from "./";

it("renders without crashing", () => {
  render(<NarrowContainer />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
    <NarrowContainer width="75%" fullWidthAt="small">
      <div>hello</div>
      <div>goodbye</div>
    </NarrowContainer>
  );
  expect(asFragment()).toMatchSnapshot();
});
