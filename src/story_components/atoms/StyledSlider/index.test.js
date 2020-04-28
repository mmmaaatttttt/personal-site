import React from "react";
import { render } from "@testing-library/react";
import StyledSlider from "./";

it("renders without crashing", () => {
  render(<StyledSlider />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
    <StyledSlider activeColor="black" inactiveColor="white" />
  );
  expect(asFragment()).toMatchSnapshot();
});
