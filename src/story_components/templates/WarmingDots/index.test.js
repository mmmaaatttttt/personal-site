import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { WarmingDots } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<WarmingDots />);
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<WarmingDots idx={0} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders second demonstration successfully", () => {
    const wrapper = shallow(<WarmingDots idx={1} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders third demonstration successfully", () => {
    const wrapper = shallow(<WarmingDots idx={2} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders fourth demonstration successfully", () => {
    const wrapper = shallow(<WarmingDots idx={3} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders fifth demonstration successfully", () => {
    const wrapper = shallow(<WarmingDots idx={4} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
