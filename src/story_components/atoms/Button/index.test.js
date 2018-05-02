import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Button from ".";

const wrap = (props = {}, text = "") =>
  shallow(<Button {...props}>{text}</Button>);

it("renders successfully", () => {
  const wrapper = wrap();
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders text when passed in successfully", () => {
  const wrapper = wrap({}, "I'm a button");
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders props when passed in", () => {
  const wrapper = wrap({ color: "blue" }, "I'm a blue button");
  expect(toJson(wrapper)).toMatchSnapshot();
});
