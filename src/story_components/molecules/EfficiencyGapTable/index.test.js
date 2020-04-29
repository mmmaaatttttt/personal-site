import React from "react";
import { render } from "@testing-library/react";
import EfficiencyGapTable from "./";

it("renders without crashing", () => {
  render(<EfficiencyGapTable />);
});

it("matches snapshot with no district counts", () => {
  const { asFragment } = render(<EfficiencyGapTable />);
  expect(asFragment()).toMatchSnapshot();
});

it("renders with district counts", () => {
  const { asFragment } = render(
    <EfficiencyGapTable
      districtCounts={[
        [
          [5, 4],
          [5, 4],
          [5, 4],
          [5, 4],
          [2, 7],
          [5, 4]
        ]
      ]}
    />
  );
  expect(asFragment()).toMatchSnapshot();
});
