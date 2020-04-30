import React from "react";
import { render } from "@testing-library/react";
import IsoperimetricExplorer from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    render(<IsoperimetricExplorer />);
  });

  it("renders first demonstration successfully", () => {
    const { asFragment } = render(<IsoperimetricExplorer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
