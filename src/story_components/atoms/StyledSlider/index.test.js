import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import StyledSlider from ".";

const wrap = (props = {}) => shallow(<StyledSlider {...props} />);

it("renders successfully", () => {
  const wrapper = wrap();
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders props when passed in", () => {
  const wrapper = wrap({ activeColor: "red", inactiveColor: "black" });
  expect(toJson(wrapper)).toMatchSnapshot();
});
