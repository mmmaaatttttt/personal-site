import React from "react";
import { render } from "@testing-library/react";
import { PureHistoricalMap } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    render(<PureHistoricalMap />);
  });

  it("renders first demonstration successfully", () => {
    const { asFragment } = render(<PureHistoricalMap />);
    expect(asFragment()).toMatchSnapshot();
  });
});
