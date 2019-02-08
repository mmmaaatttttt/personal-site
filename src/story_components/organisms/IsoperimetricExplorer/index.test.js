import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import IsoperimetricExplorer from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<IsoperimetricExplorer />);
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<IsoperimetricExplorer />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe("state changes", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<IsoperimetricExplorer />);
  });

  it("handles drag", () => {
    wrapper.instance().handleDrag(0, { x: 10, y: 10 });
    expect(wrapper.state().points[0]).toEqual({ x: 10, y: 10 });
  });

  it("resets when you change point count", () => {
    wrapper.instance().handleValueChange(5);
    expect(wrapper.state().points).toHaveLength(5);
  });
});
