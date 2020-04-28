import React from "react";
import { render } from "@testing-library/react";
import Icon from "./";

it("renders without crashing", () => {
  render(<Icon />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
    <Icon name="arrows" color="orange" opacity={0.5} size={2} disabled />
  );
  expect(asFragment()).toMatchSnapshot();
});
