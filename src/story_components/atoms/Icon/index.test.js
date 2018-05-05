import React from "react";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import Icon from ".";

const wrap = (props = {}) => mount(<Icon {...props} />);

it("renders successfully", () => {
  const wrapper = wrap({ name: "user-o", disabled: false });
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders other props when passed in", () => {
  const wrapper = wrap({
    name: "arrows",
    size: 2,
    disabled: true,
    opacity: 0.5,
    color: "blue"
  });
  expect(toJson(wrapper)).toMatchSnapshot();
});
