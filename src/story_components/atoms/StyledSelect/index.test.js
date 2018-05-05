import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import StyledSelect from ".";

const wrap = (props = {}) => shallow(<StyledSelect {...props} />);

it("renders successfully", () => {
  const wrapper = wrap();
  expect(toJson(wrapper)).toMatchSnapshot();
});
