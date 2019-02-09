import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { CoinFlipBayesianModel } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<CoinFlipBayesianModel />);
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<CoinFlipBayesianModel />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe("state changes", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<CoinFlipBayesianModel />);
  });

  it("handles switch change", () => {
    wrapper.instance().toggleDistribution();
    expect(wrapper.state().uniform).toBe(false);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("handles heads increase", () => {
    expect(wrapper.state().heads).toBe(0);
    wrapper
      .find("Button")
      .at(0)
      .simulate("click");
    expect(wrapper.state().heads).toBe(1);
  });

  it("handles tails increase", () => {
    expect(wrapper.state().tails).toBe(0);
    wrapper
      .find("Button")
      .at(1)
      .simulate("click");
    expect(wrapper.state().tails).toBe(1);
  });

  it("handles reset", () => {
    wrapper.setState({ heads: 10, tails: 8 });
    wrapper
      .find("Button")
      .at(2)
      .simulate("click");
    expect(wrapper.state()).toMatchObject({ heads: 0, tails: 0 });
  });
});
