import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Legend from ".";

it("renders successfully", () => {
  shallow(<Legend />);
});

it("matches snapshot with props passed in", () => {
  const wrapper = shallow(<Legend />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
