import React from "react";
import { render } from "@testing-library/react";
import { SampleGerrymander } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    render(<SampleGerrymander />);
  });

  it("renders first demonstration successfully", () => {
    const { asFragment } = render(<SampleGerrymander />);
    expect(asFragment()).toMatchSnapshot();
  });
});
