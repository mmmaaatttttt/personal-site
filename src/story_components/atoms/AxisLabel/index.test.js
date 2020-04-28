import React from "react";
import { render } from "@testing-library/react";
import AxisLabel from "./";

it("renders without crashing", () => {
  render(<AxisLabel />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(<AxisLabel anchor="start">x axis</AxisLabel>);
  expect(asFragment()).toMatchSnapshot();
});
