import React from "react";
import { render } from "@testing-library/react";
import CaptionWrapper from "./";

it("renders without crashing", () => {
  render(<CaptionWrapper />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
    <CaptionWrapper caption="I'm a caption!">
      <p>I'm a p tag with a caption!</p>
    </CaptionWrapper>
  );
  expect(asFragment()).toMatchSnapshot();
});
