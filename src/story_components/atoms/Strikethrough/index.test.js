import React from "react";
import { render } from "@testing-library/react";
import Strikethrough from "./";

it("renders without crashing", () => {
  render(<Strikethrough />);
});

it("matches snapshot", () => {
  const { asFragment } = render(<Strikethrough>Strikethrough</Strikethrough>);
  expect(asFragment()).toMatchSnapshot();
});
