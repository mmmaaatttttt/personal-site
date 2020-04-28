import React from "react";
import { render } from "@testing-library/react";
import NoScrollCircle from "./";

it("renders without crashing", () => {
  render(<NoScrollCircle />);
});

it("matches snapshot with props", () => {
  const { asFragment } = render(<NoScrollCircle stroke="blue" />);
  expect(asFragment()).toMatchSnapshot();
});
