import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { PureHistoricalMap } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<PureHistoricalMap />);
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<PureHistoricalMap />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});