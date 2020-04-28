import React from "react";
import { render } from "@testing-library/react";
import StyledInput from "./";

it("renders without crashing", () => {
  render(<StyledInput />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(<StyledInput />);
  expect(asFragment()).toMatchSnapshot();
});
