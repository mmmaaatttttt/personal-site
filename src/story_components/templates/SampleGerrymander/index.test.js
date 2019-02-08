import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { SampleGerrymander } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<SampleGerrymander />);
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<SampleGerrymander />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe("state changes", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SampleGerrymander />);
  });

  it("detects the formation of new districts", () => {
    const { segments } = wrapper.state();
    const row = 1;
    for (let i = 0; i < segments[row].length; i++) {
      expect(wrapper.state().districts).toHaveLength(1);
      expect(wrapper.state().districts[0]).toHaveLength(54);
      wrapper.instance().handleSegmentUpdate(1, i, true);
    }
    expect(wrapper.state().districts).toHaveLength(2);
    expect(wrapper.state().districts[0]).toHaveLength(9);
    expect(wrapper.state().districts[1]).toHaveLength(45);
  });

  it("detects when there are too many districts", () => {
    const { segments } = wrapper.state();
    // make horizontal row districts
    const newSegments = segments.map((row, i) =>
      i % 2 === 0 ? row : row.map(bool => !bool)
    );
    wrapper.setState({ segments: newSegments });
    wrapper.instance().__countRegions();
    expect(wrapper.find("Icon")).toHaveLength(6);

    newSegments[0][1] = true;
    wrapper.setState({ segments: newSegments });
    wrapper.instance().__countRegions();
    expect(wrapper.find("Icon")).toHaveLength(0);
    expect(wrapper.text()).toContain("Too many districts!");
  });

  it("detects when a district is the right size", () => {
    const { segments } = wrapper.state();
    const newSegments = segments.map((row, i) =>
      i !== 1 ? row : row.map(bool => !bool)
    );

    expect(wrapper.find("Icon[name='check-circle']")).toHaveLength(0);
    wrapper.setState({ segments: newSegments });
    wrapper.instance().__countRegions();
    expect(wrapper.find("Icon[name='check-circle']")).toHaveLength(1);
  });

  it("detects when a district is the wrong size", () => {
    const { segments } = wrapper.state();

    const newSegments = segments.map(row => [...row]);
    newSegments[0][0] = true;
    newSegments[1][0] = true;

    expect(wrapper.find("Icon[name='check-circle']")).toHaveLength(0);
    expect(wrapper.state().districts).toHaveLength(1);
    wrapper.setState({ segments: newSegments });
    wrapper.instance().__countRegions();
    expect(wrapper.state().districts).toHaveLength(2);
    expect(wrapper.find("Icon[name='check-circle']")).toHaveLength(0);
  });
});
