import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Caption from ".";

const wrap = (props = {}, text = "") => shallow(<Caption>{text}</Caption>);

it("renders successfully", () => {
  const wrapper = wrap();
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders text when passed in successfully", () => {
  const wrapper = wrap({}, "Here's a caption lolz");
  expect(toJson(wrapper)).toMatchSnapshot();
});
