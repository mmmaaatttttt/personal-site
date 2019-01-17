import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import StyledSelect from ".";

it("renders successfully", () => {
  shallow(<StyledSelect />);
});

it("matches snapshot", () => {
  const wrapper = shallow(<StyledSelect />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
