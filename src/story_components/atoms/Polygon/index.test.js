import React from "react";
import { render } from "@testing-library/react";
import Polygon from "./";

it("renders without crashing", () => {
  render(<Polygon />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
    <Polygon
      fill="blue"
      stroke="purple"
      strokeWidth={1}
      points={[
        { x: 50, y: 50 },
        { x: 100, y: 200 },
        { x: 0, y: 200 }
      ]}
    >
      <div>hello</div>
      <div>goodbye</div>
    </Polygon>
  );
  expect(asFragment()).toMatchSnapshot();
});
