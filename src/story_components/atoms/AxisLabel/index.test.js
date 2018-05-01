import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import AxisLabel from ".";

const wrap = (props = {}, text = "") =>
  shallow(<AxisLabel {...props}>{text}</AxisLabel>);

it("renders successfully", () => {
  const wrapper = wrap();
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders text when passed in successfully", () => {
  const wrapper = wrap({}, "x-axis");
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders props when passed in", () => {
  ["start", "middle", "end"].forEach(anchor => {
    const wrapper = wrap({ anchor }, "axis label");
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
