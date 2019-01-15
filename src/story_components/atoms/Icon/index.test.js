import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Icon from ".";

it("renders successfully", () => {
  shallow(<Icon />);
});

it("matches snapshot", () => {
  const wrapper = shallow(
    <Icon name="arrows" color="orange" opacity={0.5} size={2} disabled />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
