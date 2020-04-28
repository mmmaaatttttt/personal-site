import React from "react";
import { render } from "@testing-library/react";
import TranslucentRect from "./";

it("renders without crashing", () => {
  render(<TranslucentRect />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(<TranslucentRect />);
  expect(asFragment()).toMatchSnapshot();
});
