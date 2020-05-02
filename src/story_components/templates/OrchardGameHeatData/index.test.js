import React from "react";
import { render } from "@testing-library/react";
import { OrchardGameHeatData } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    render(<OrchardGameHeatData />);
  });

  it("renders first demonstration successfully", () => {
    const { asFragment } = render(<OrchardGameHeatData />);
    expect(asFragment()).toMatchSnapshot();
  });
});
