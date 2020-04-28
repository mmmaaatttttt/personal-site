import React from "react";
import { render } from "@testing-library/react";
import { scaleLinear } from "d3-scale";
import LinePlot from "./";

it("renders without crashing", () => {
  render(<LinePlot />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
    <LinePlot
      graphData={[
        { x: 10, y: 10 },
        { x: 20, y: 25 },
        { x: 30, y: 40 },
        { x: 50, y: 20 }
      ]}
      xScale={scaleLinear().domain([10, 50]).range([0, 200])}
      yScale={scaleLinear().domain([20, 40]).range([0, 600])}
      stroke="blue"
      strokeWidth="10"
    />
  );
  expect(asFragment()).toMatchSnapshot();
});
