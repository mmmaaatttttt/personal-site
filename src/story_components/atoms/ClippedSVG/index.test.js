import React from "react";
import { render } from "@testing-library/react";
import ClippedSVG from "./";

it("renders without crashing", () => {
  render(<ClippedSVG />);
});

it("renders with an object for padding", () => {
  const { asFragment } = render(
    <ClippedSVG padding={{ top: 10, right: 20, bottom: 30, left: 40 }} />
  );
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot with children", () => {
  const { asFragment } = render(
    <ClippedSVG id="svg" width={500} height={300} padding={10}>
      <rect x={0} y={10} width={100} height={200} />
      <circle cx={300} cy={100} r={100} />
    </ClippedSVG>
  );
  expect(asFragment()).toMatchSnapshot();
});
