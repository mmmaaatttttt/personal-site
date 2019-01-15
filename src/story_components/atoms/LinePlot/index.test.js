import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { scaleLinear } from "d3-scale";
import LinePlot from ".";

it("renders successfully", () => {
  shallow(<LinePlot />);
});

it("matches snapshot", () => {
  const wrapper = shallow(
    <LinePlot
      graphData={[
        { x: 10, y: 10 },
        { x: 20, y: 25 },
        { x: 30, y: 40 },
        { x: 50, y: 20 }
      ]}
      xScale={scaleLinear()
        .domain([10, 50])
        .range([0, 200])}
      yScale={scaleLinear()
        .domain([20, 40])
        .range([0, 600])}
      stroke="blue"
      strokeWidth="10"
    />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
