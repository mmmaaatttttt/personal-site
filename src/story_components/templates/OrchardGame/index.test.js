import React from "react";
import { render } from "@testing-library/react";
import { OrchardGame } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    render(<OrchardGame />);
  });

  it("renders first demonstration successfully", () => {
    const { asFragment } = render(<OrchardGame />);
    expect(asFragment()).toMatchSnapshot();
  });
});
