import React from "react";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import Latex from ".";

const wrap = (props = {}) => mount(<Latex {...props} />);

it("renders successfully", () => {
  const wrapper = wrap();
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders props when passed in", () => {
  const wrapper = wrap({
    displayMode: true,
    str: `\\begin{aligned} A^{\\prime} (t) &= a \\times B(t), \\\\ B^{\\prime} (t) &= b \\times A(t), \\end{aligned}`
  });
  expect(toJson(wrapper)).toMatchSnapshot();
});
