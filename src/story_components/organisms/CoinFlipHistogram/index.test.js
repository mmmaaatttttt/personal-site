import React from "react";
import { render } from "@testing-library/react";
import { CoinFlipHistogram } from "./";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    render(<CoinFlipHistogram />);
  });

  it("renders first demonstration successfully", () => {
    const { asFragment } = render(<CoinFlipHistogram />);
    expect(asFragment()).toMatchSnapshot();
  });
});
