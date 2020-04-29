import React from "react";
import { render } from "@testing-library/react";
import Legend from "./";

it("renders without crashing", () => {
  render(<Legend />);
});

it("matches snapshot for a fair coin", () => {
  const { asFragment } = render(<Legend />);
  expect(asFragment()).toMatchSnapshot();
});
