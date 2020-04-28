import React from "react";
import { render } from "@testing-library/react";
import Alert from "./";

it("renders without crashing", () => {
  render(<Alert />);
});

it("matches snapshot", () => {
  const { asFragment } = render(<Alert />);
  expect(asFragment()).toMatchSnapshot();
});
