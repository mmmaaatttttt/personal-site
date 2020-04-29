import React from "react";
import { render } from "@testing-library/react";
import ButtonGroup from "./";

const testData = [
  {
    key: 1,
    color: "blue",
    buttonText: "button 1",
    handleClick: () => {}
  },
  {
    key: 2,
    color: "red",
    buttonText: "another one",
    handleClick: () => {}
  }
];

it("renders without crashing", () => {
  render(<ButtonGroup data={testData} />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(<ButtonGroup data={testData} />);
  expect(asFragment()).toMatchSnapshot();
});
