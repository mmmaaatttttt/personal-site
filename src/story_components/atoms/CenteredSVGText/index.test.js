import React from "react";
import { render } from "@testing-library/react";
import CenteredSVGText from "./";

it("renders without crashing", () => {
  render(<CenteredSVGText />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
    <CenteredSVGText fontSize="90%" baseline="central">
      in the center
    </CenteredSVGText>
  );
  expect(asFragment()).toMatchSnapshot();
});
