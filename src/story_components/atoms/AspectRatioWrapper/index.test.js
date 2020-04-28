import React from "react";
import { render } from "@testing-library/react";
import AspectRatioWrapper from "./";

it("renders without crashing", () => {
  render(<AspectRatioWrapper />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
    <AspectRatioWrapper heightOverWidth={3 / 4}>
      <p>Hello World</p>
    </AspectRatioWrapper>
  );
  expect(asFragment()).toMatchSnapshot();
});
