import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import AxisLabel from ".";

it("renders successfully", () => {
  shallow(<AxisLabel />)
});

it("matches snapshot", () => {
  const wrapper = shallow(<AxisLabel anchor="start" >x axis</AxisLabel>)
  expect(toJson(wrapper)).toMatchSnapshot();
});
