import React from "react";
import { render } from "@testing-library/react";
import SVGBorder from "./";

it("renders without crashing", () => {
  render(<SVGBorder />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
    <SVGBorder width={200} height={200} borderWidth={6} borderStroke="purple" />
  );
  expect(asFragment()).toMatchSnapshot();
});
