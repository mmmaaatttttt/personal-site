import React from "react";
import { render } from "@testing-library/react";
import ColumnLayout from "./";

it("renders without crashing", () => {
  render(<ColumnLayout />);
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <ColumnLayout break="large">
      <div>Here's a child</div>
      <div>Here's another</div>
    </ColumnLayout>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("lets you make columns of different widths", () => {
  const { asFragment } = render(
    <ColumnLayout break="small" sizes={[3, 2]}>
      <div>Here's a child</div>
      <div>Here's another</div>
    </ColumnLayout>
  );
  expect(asFragment()).toMatchSnapshot();
});
