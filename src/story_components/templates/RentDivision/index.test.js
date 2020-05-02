import React from "react";
import { render } from "@testing-library/react";
import { RentDivision } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    render(<RentDivision />);
  });

  it("renders first demonstration successfully", () => {
    const { asFragment } = render(<RentDivision />);
    expect(asFragment()).toMatchSnapshot();
  });
});
