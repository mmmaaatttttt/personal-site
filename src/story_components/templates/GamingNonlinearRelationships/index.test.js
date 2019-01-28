import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { GamingNonlinearRelationships } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<GamingNonlinearRelationships />);
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<GamingNonlinearRelationships idx={0} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders second demonstraction successfully", () => {
    const wrapper = shallow(<GamingNonlinearRelationships idx={1} max={40} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe("state changes to differential equation solutions", () => {
  it("updates correctly in first demonstration", () => {
    const idx = 0;
    const wrapper = shallow(<GamingNonlinearRelationships idx={idx} />);
    wrapper.setState({ values: [-1, 2.2, -0.1, 2.4, -0.7, 0.3] });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("updates correctly in second demonstration", () => {
    const idx = 1;
    const wrapper = shallow(
      <GamingNonlinearRelationships idx={idx} max={40} />
    );
    wrapper.setState({ values: [ -0.9, -2.1, 1.1, 0.5, -1.8, 2.4, 1.1, 1.9, -2.3, -0.1 ]});
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
