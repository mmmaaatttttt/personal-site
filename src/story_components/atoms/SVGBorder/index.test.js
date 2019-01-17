import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import SVGBorder from ".";

it("renders successfully", () => {
  shallow(<SVGBorder />);
});

it("matches snapshot with props", () => {
  const wrapper = shallow(
    <SVGBorder width={200} height={200} borderWidth={6} borderStroke="purple" />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
