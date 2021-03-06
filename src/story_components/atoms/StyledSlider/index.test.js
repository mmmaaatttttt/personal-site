import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import StyledSlider from ".";

it("renders successfully", () => {
  shallow(<StyledSlider />);
});

it("matches snapshot with props", () => {
  const wrapper = shallow(
    <StyledSlider activeColor="black" inactiveColor="white" />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
