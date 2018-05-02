import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import CenteredSVGText from ".";

const wrap = (props = {}, text = "") =>
  shallow(<CenteredSVGText {...props}>{text}</CenteredSVGText>);

it("renders successfully", () => {
  const wrapper = wrap();
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders text when passed in successfully", () => {
  const wrapper = wrap({}, "Here's some centered text");
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders props when passed in", () => {
  const wrapper = wrap({ fontSize: "80%" }, "MOAR TEXT");
  expect(toJson(wrapper)).toMatchSnapshot();
});
