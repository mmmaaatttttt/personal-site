import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Caption from ".";

it("renders successfully", () => {
  shallow(<Caption />);
});

it("matches snapshot", () => {
  const wrapper = shallow(
    <Caption captionMarginTop="10px">captiony mccaption</Caption>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
