import React from "react";
import { render } from "@testing-library/react";
import CoinFlipTable from "./";

it("renders without crashing", () => {
  render(<CoinFlipTable />);
});

it("matches snapshot for a fair coin", () => {
  const { asFragment } = render(<CoinFlipTable />);
  expect(asFragment()).toMatchSnapshot();
});
